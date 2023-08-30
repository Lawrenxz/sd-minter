import * as yup from "yup";

const validationSchema = yup.object({
  name: yup.string(),
  description: yup.string(),
});

export { validationSchema };
