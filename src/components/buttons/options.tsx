
import { type FlyoutOptionsProps } from "../../types/buttons/FlyoutOptions";

export const enrollmentOptions: FlyoutOptionsProps[] = [
    { label: "Import students", divider: true, onClick: () => { alert("Import students"); } },
    { label: "Export template with data", divider: false, onClick: () => { alert("Export template with data"); } }
  ];
