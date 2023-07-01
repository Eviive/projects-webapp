import { Props as PopupProps } from "components/common/Popup/Popup";
import { useState } from "react";

export const usePopup = (): [ PopupProps,  (data: Partial<PopupProps>) => void ] => {
    const [ popup, setPopup ] = useState<PopupProps>({
        show: false,
        handleClose: () => setPopup(prevPopup => ({ ...prevPopup, show: false }))
    });

    const showPopup = (data: Partial<PopupProps>) => setPopup(prevPopup => ({ ...prevPopup, ...data, show: true }));

    return [ popup, showPopup ];
};
