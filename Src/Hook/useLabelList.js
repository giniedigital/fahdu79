import {useState, useCallback} from 'react';
import {useLazyGetAllLabelNameQuery} from '../../Redux/Slices/QuerySlices/chatWindowAttachmentSliceApi';

export const useLabelList = token => {
  const [labelList, setLabelList] = useState([
    {
      id: 1,
      name: 'Purple',
      color: '#BBBBFE',
      iconName: 'back-in-time',
      labelName: 'LABEL1',
    },
    {
      id: 2,
      name: 'Yellow',
      color: '#FBF7A6',
      iconName: 'arrow-down',
      labelName: 'LABEL2',
    },
    {
      id: 3,
      name: 'Green',
      color: '#98FF98',
      iconName: 'mail-unread-outline',
      labelName: 'LABEL3',
    },
  ]);

  const [getAllLabelNames] = useLazyGetAllLabelNameQuery();

  const getAllLabelNamesHandler = useCallback(async () => {
    const {data, error} = await getAllLabelNames({token});

    if (data?.data) {
      const updatedList = labelList.map(label => {
        const updatedName = data.data?.[label.labelName]?.name;
        return {
          ...label,
          name: updatedName || label.name,
        };
      });

      setLabelList(updatedList);
    }

    if (error) {
      console.log(error, 'PPP error');
    }
  }, [token, labelList]);

  return {
    labelList,
    setLabelList,
    getAllLabelNamesHandler,
  };
};
