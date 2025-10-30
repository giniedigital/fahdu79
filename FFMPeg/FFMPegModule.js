import RNFS from 'react-native-fs';
import {FFmpegKit, MediaInformation, FFprobeKit, ReturnCode, FFmpegKitConfig, Statistics} from 'ffmpeg-kit-react-native';
import {Platform} from 'react-native';

export const generateBase64Image = async uri => {
  try {
    if (uri) {
      console.log(uri?.split('file://').at(-1), '{}{}{}{');

      return FFmpegKit.execute(`-i ${Platform.OS === 'ios' ? uri?.split('file://').at(-1) : uri} -vf scale=15:15 ${RNFS.CachesDirectoryPath}/encodedImage%03d.jpg -loglevel quiet -y`).then(async session => {
        let returnCodeBySession = await session.getReturnCode();

        if (ReturnCode.isSuccess(returnCodeBySession)) {
          let result = await RNFS.readFile(`${RNFS.CachesDirectoryPath}/encodedImage001.jpg`, 'base64');

          return `data:image/png;base64,` + result;
        } else {
          console.log('FFMPeg Error While converting base 64');
        }
      });
    } else {
      console.log('Please pass selected image url to generateImageThumbnail');
    }
  } catch (e) {
    console.log('Error at generateImageThumbnail', e.message);
  }
};

const getVideoInformation = async uri => {
  return FFprobeKit.getMediaInformation(uri).then(async session => {
    const information = session.getMediaInformation();

    let bitRate = information.getBitrate();

    let bitRateInKbps = ((bitRate - (10 / 100) * bitRate) / 1024).toFixed(0);

    return bitRateInKbps;
  });
};

const platformCommander = (uri, bitRateToSet) => {
  console.log(uri, bitRateToSet, '::::::::::::::::::::::');

  if (Platform.OS === 'android') {
    return `-hwaccel mediacodec -i ${uri} -c:a copy -c:v h264_mediacodec -b:v ${bitRateToSet}k ${RNFS.CachesDirectoryPath}/fahduReducedVideo.mp4 -y`;
  } else {
    return `-i ${uri} -c:v h264_videotoolbox -b:v ${bitRateToSet}k -maxrate ${bitRateToSet}k -bufsize ${bitRateToSet}k -c:a copy ${RNFS.CachesDirectoryPath}/fahduReducedVideo.mp4 -y`;
  }
};

export const videoReducer = async (uri, providedBitrateBps = null) => {
  if (!uri) {
    console.error('Video URI must be provided.');
    return null;
  }

  try {
    let originalBitrate = providedBitrateBps;

    // --- 1. Get Video Bitrate if Not Provided ---
    if (!originalBitrate) {
      console.log('Bitrate not provided, calculating it now...');
      const sessionInfo = await FFprobeKit.getMediaInformation(uri);
      const information = sessionInfo.getMediaInformation();
      originalBitrate = information.getBitrate();

      if (!originalBitrate) {
        console.error('Could not determine original bitrate.');
        return null;
      }
    }

    // --- 2. Calculate New Target Video Bitrate (10% reduction) ---
    const targetBitrateBps = originalBitrate * 0.9;
    const targetBitrateKbps = Math.round(targetBitrateBps / 1024);

    // --- 3. Prepare a Unique Output Path & Command ---
    const outputPath = `${RNFS.CachesDirectoryPath}/${Date.now()}_reduced.mp4`;
    let command;

    // This part re-encodes the audio to a standard 128kbps AAC format
    const audioCommand = '-c:a aac -b:a 128k';

    if (Platform.OS === 'android') {
      command = `-i "${uri}" ${audioCommand} -c:v h264_mediacodec -b:v ${targetBitrateKbps}k ${outputPath} -y`;
    } else {
      command = `-i "${uri}" ${audioCommand} -c:v h264_videotoolbox -b:v ${targetBitrateKbps}k ${outputPath} -y`;
    }

    console.log(`Executing FFmpeg command with audio compression: ${command}`);

    // --- 4. Execute FFmpeg Compression ---
    const session = await FFmpegKit.execute(command);
    const returnCode = await session.getReturnCode();

    if (ReturnCode.isSuccess(returnCode)) {
      console.log('Video and audio compression successful!');
      return `file://${outputPath}`;
    } else {
      console.error(`FFmpeg process failed with return code ${returnCode}.`);
      const logs = await session.getLogsAsString();
      console.error('FFmpeg Logs:', logs);
      return null;
    }
  } catch (e) {
    console.error('An unexpected error occurred in videoReducer:', e);
    return null;
  }
};

export const generateVideoThumbnail = async uri => {
  if (!uri) {
    console.error('Video URI must be provided to generate a thumbnail.');
    return null;
  }

  try {
    const outputPath = `${RNFS.CachesDirectoryPath}/${Date.now()}.jpg`;

    // -ss 00:00:01.000: Seeks to the 1-second mark.
    // Placing -ss BEFORE -i makes the seek operation nearly instantaneous.
    // -frames:v 1: Extracts only one frame.
    const command = `-ss 00:00:01.000 -i "${uri}" -frames:v 1 ${outputPath} -y`;

    const session = await FFmpegKit.execute(command);
    const returnCode = await session.getReturnCode();

    if (ReturnCode.isSuccess(returnCode)) {
      console.log('Thumbnail generated successfully at:', outputPath);
      return `file://${outputPath}`;
    } else {
      console.error('Failed to generate thumbnail.');
      // Log the actual FFmpeg output for debugging
      const logs = await session.getLogsAsString();
      console.error('FFmpeg Logs:', logs);
      return null;
    }
  } catch (e) {
    console.error('An error occurred while generating thumbnail:', e);
    return null;
  }
};

export const reduceImageSize = async uri => {
  try {
    if (!uri) {
      console.log('Please provide an image URI');
      return;
    }

    let outputPath = `${RNFS.CachesDirectoryPath}/compressed_image.jpg`;

    // FFmpeg Command to compress image
    let command = `-i ${uri} -vf "scale=iw*0.7:ih*0.7" -q:v 5 -y ${outputPath}`;

    return FFmpegKit.execute(command).then(async session => {
      let returnCodeBySession = await session.getReturnCode();

      if (ReturnCode.isSuccess(returnCodeBySession)) {
        let fileStat = await RNFS.stat(outputPath);

        // If file is still above 500KB, retry with a lower quality
        if (fileStat.size > 500 * 1024) {
          let retryCommand = `-i ${outputPath} -vf "scale=iw*0.5:ih*0.5" -q:v 8 -y ${outputPath}`;
          await FFmpegKit.execute(retryCommand);
        }

        return `file://${outputPath}`;
      } else {
        console.log('FFmpeg Error While Reducing Image Size');
      }
    });
  } catch (e) {
    console.log('Error reducing image size:', e.message);
  }
};

export async function getImageSize(filePath) {
  try {
    const session = await FFprobeKit.execute(`-i "${filePath}" -show_entries stream=width,height -of json`);
    const returnCode = await session.getReturnCode();
    //   console.log(returnCode.i)

    if (returnCode.isValueSuccess()) {
      const output = await session.getOutput();
      const jsonResult = JSON.parse(output);
      const streams = jsonResult.streams;

      if (streams.length > 0) {
        return {width: streams[0].width, height: streams[0].height};
      }
    }
    throw new Error('Failed to get image size');
  } catch (error) {
    console.error('FFprobe error:', error);
    return null;
  }
}

export const convertPngToJpeg = async (inputPath, outputPath) => {
  const quality = 90;

  try {
    // Validate input
    if (!inputPath) {
      throw new Error('Invalid PNG input path');
    }

    // Set default output path if not provided
    const finalOutputPath = outputPath || `${RNFS.TemporaryDirectoryPath}${Date.now()}.jpg`;

    // FFmpeg command:
    // - -y: overwrite output without asking
    // - -i: input file
    // - -q:v: quality (1-100, higher is better)
    // - -background: white background for transparent PNGs
    // - -flatten: remove alpha channel
    const command = `-y -i "${inputPath}" -q:v ${quality} "${finalOutputPath}"`;

    console.log(`Executing FFmpeg command: ${command}`);

    // Execute FFmpeg command
    const session = await FFmpegKit.execute(command);

    // Check return code
    const returnCode = await session.getReturnCode();

    if (returnCode.isValueSuccess()) {
      console.log('Conversion successful');
      return finalOutputPath;
    } else {
      const output = await session.getOutput();
      const error = await session.getFailStackTrace();
      throw new Error(`FFmpeg failed: ${error || output || 'Unknown error'}`);
    }
  } catch (error) {
    console.error('Conversion error:', error);
    throw error;
  }
};

export function resizeImage(inputPath, outputPath) {
  return new Promise(async (resolve, reject) => {
    try {
      const fileExists = await RNFS.exists(inputPath);
      if (!fileExists) {
        reject('Input file does not exist');
        return;
      }

      // CORRECTED command for resizing an image
      const command = `-y -i "${inputPath}" -vf scale=256:256:force_original_aspect_ratio=decrease,pad=256:256:(ow-iw)/2:(oh-ih)/2:white "${outputPath}"`;

      FFmpegKit.execute(command).then(async session => {
        const returnCode = await session.getReturnCode();

        if (returnCode.isValueSuccess()) {
          resolve(outputPath);
        } else {
          const failStackTrace = await session.getFailStackTrace();
          reject(`FFmpeg failed: ${failStackTrace}`);
        }
      });
    } catch (error) {
      reject(error.message || error);
    }
  });
}

// --- Your Validation Rules ---
const MAX_FILE_SIZE_BYTES = 150 * 1024 * 1024; // 150MB
const UHD_SHORT_DIMENSION = 2160; // 4K resolution threshold
const MAX_DURATION_MS = 60 * 1000; // 1 minute in milliseconds

// Helper function to get a common resolution name
const getResolutionName = (width, height) => {
  const shortDimension = Math.min(width, height);
  if (shortDimension >= 2160) return '4K UHD';
  if (shortDimension >= 1080) return '1080p (Full HD)';
  if (shortDimension >= 720) return '720p (HD)';
  return 'Lower Resolution';
};

export const getVideoMetadata = async filePath => {
  if (!filePath || typeof filePath !== 'string') {
    console.error(`Invalid filePath provided: ${filePath}`);
    return null;
  }

  const command = `-v quiet -print_format json -show_format -show_streams "${filePath}"`;

  try {
    const session = await FFprobeKit.execute(command);
    const returnCode = await session.getReturnCode();

    if (ReturnCode.isSuccess(returnCode)) {
      const output = await session.getOutput();
      const mediaInfo = JSON.parse(output);
      const videoStream = mediaInfo.streams.find(s => s.codec_type === 'video');

      if (!videoStream) {
        return {isValid: false, validationReason: 'No video stream found in the file.'};
      }

      // --- Extract all the necessary data ---
      const width = videoStream.width;
      const height = videoStream.height;
      const size = mediaInfo.format.size;
      const duration = Math.round(parseFloat(mediaInfo.format.duration) * 1000);
      const bitrate = mediaInfo.format.bit_rate; // <-- 1. Extract the bitrate here

      // --- Integrated Validation Logic ---
      let isValid = true;
      let validationReason = 'Video is valid.';

      if (size > MAX_FILE_SIZE_BYTES) {
        isValid = false;
        const sizeInMB = (size / 1024 / 1024).toFixed(2);
        validationReason = `File size (${sizeInMB}MB) exceeds the 150MB limit.`;
      } else if (Math.min(width, height) >= UHD_SHORT_DIMENSION) {
        isValid = false;
        validationReason = `Video resolution (${width}x${height}) is 4K or higher, which is not allowed.`;
      } else if (duration > MAX_DURATION_MS) {
        isValid = false;
        const durationInSeconds = (duration / 1000).toFixed(1);
        validationReason = `Video duration (${durationInSeconds}s) exceeds the 1 minute limit.`;
      }

      const result = {
        size,
        width,
        height,
        duration,
        bitrate, // <-- 2. Add the bitrate to the returned object
        resolutionName: getResolutionName(width, height),
        isValid,
        validationReason,
      };

      console.log('Video processing complete:', result);
      return result;
    } else {
      console.error(`FFprobe failed with return code ${returnCode}`);
      return {isValid: false, validationReason: 'Failed to process video file.'};
    }
  } catch (error) {
    console.error(`Error in getVideoMetadata for ${filePath}:`, error);
    return null;
  }
};
