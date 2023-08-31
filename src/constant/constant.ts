import { toast } from "react-toastify";

const header = {
  fontSize: {
    xs: "32px !important",
    sm: "48px !important",
    md: "64px !important",
    lg: "80px !important",
  },
  background: "linear-gradient(rgba(255, 255, 255, 1), rgba(183, 183, 183, 1))",
  WebkitBackgroundClip: "text",
  MozBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
  textShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
  fontWeight: "700",
  textAlign: "center",
};
const subHeader = {
  fontSize: "18px !important",
  fontStyle: "italic",
  background: "linear-gradient(rgba(255, 255, 255, 1), rgba(183, 183, 183, 1))",
  WebkitBackgroundClip: "text",
  MozBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
  textShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
  fontWeight: "700",
  textAlign: "center",
};

const name = {
  fontSize: "40px !important",
  background: "linear-gradient(rgba(255, 255, 255, 1), rgba(183, 183, 183, 1))",
  WebkitBackgroundClip: "text",
  MozBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
  textShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
  fontWeight: "700",
};
const subHeaderTitle = {
  fontSize: "25px !important",

  background: "linear-gradient(rgba(255, 255, 255, 1), rgba(183, 183, 183, 1))",
  WebkitBackgroundClip: "text",
  MozBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
  textShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
  fontWeight: "700",
};
const description = {
  fontSize: "20px !important",
  background: "linear-gradient(rgba(255, 255, 255, 1), rgba(183, 183, 183, 1))",
  WebkitBackgroundClip: "text",
  MozBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
  textShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
  fontWeight: "400",
  textAlign: "left",
};

const notifyToast = (
  message: string,
  type: "info" | "success" | "warning" | "error" | "default"
) =>
  toast(message, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    rtl: false,
    pauseOnFocusLoss: true,
    draggable: true,
    pauseOnHover: true,
    type,
  });
export { header, subHeader, name, description, subHeaderTitle, notifyToast };
