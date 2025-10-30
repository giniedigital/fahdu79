import { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";

import { useLazyContactInfoQuery } from "../../Redux/Slices/QuerySlices/chatWindowAttachmentSliceApi";
import { setAllDescriptions } from "../../Redux/Slices/NormalSlices/AuthSlice";

export function useContactInfo(token, userId) {

  console.log(token, userId, "hookeffect")

  const dispatch = useDispatch();

  // RTK Query lazy query
  const [triggerContactInfo] = useLazyContactInfoQuery();

  const fetchContactInfo = useCallback(
    async () => {
      if (!userId) return;

      try {
        // use unwrap() so we can handle errors in try/catch
        const response = await triggerContactInfo({ token, userId }).unwrap();

        console.log("MYRP", response?.data?.AudioCall);

        if (response?.statusCode === 200 && response?.data) {
          dispatch(
            setAllDescriptions({
              audioCall_info: response.data.AudioCall ?? null,
              videoCall_info: response.data.VideoCall ?? null,
              chat_info: response.data.Chat ?? null,
              liveStream_info: response.data.LiveStream ?? null,
            }),
          );
        }

        console.log("Response data:", response?.data);
      } catch (error) {
        console.error("Error fetching contact info:", error);
      }
    },
    [token, userId, dispatch, triggerContactInfo],
  );

  useEffect(() => {
    fetchContactInfo();
  }, [fetchContactInfo]);

  return { fetchContactInfo }; 
}
