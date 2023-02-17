import React from "react"; // import from node modules
import { Formik } from "formik";
import * as yup from "yup";
import { Box, Button, TextField, Typography } from "@mui/material";

const reviewSchema = yup.object().shape({
  user: yup.string().trim().required("This field is required"),
  post: yup.string().trim().required("This field is required"),
});

const initialValuesReview = {
  user: "",
  post: "",
};

// create a component
const Review = () => {
  const postReview = async (values, onSubmitProps) => {
    try {
      const postReviewResponse = await fetch(
        "http://localhost:8001/review/:id",
        {
          method: "POST",
          headers: { "Content-Type": "application/json " },
          body: JSON.stringify(values),
        }
      );
      const postReview = await postReviewResponse.json();
      onSubmitProps.resetForm();

      if (!postReview.err) {
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Formik
      onSubmit={postReview}
      initialValues={initialValuesReview}
      validationSchema={reviewSchema}
    >
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue,
        resetForm,
      }) => (
        <form onSubmit={handleSubmit} className="review-form">
          <TextField
            className="review-input"
            label="User"
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.user}
            name="user"
            error={Boolean(touched.user) && Boolean(errors.user)}
            helperText={touched.user && errors.user}
            sx={{ gridColumn: "span 1" }}
          />
          <TextField
            className="review-input"
            label="Tell us about your experience..."
            multiline
            rows={10}
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.post}
            name="post"
            error={Boolean(touched.post) && Boolean(errors.post)}
            helperText={touched.post && errors.post}
            sx={{ gridColumn: "span 3" }}
          />

          <Box sx={{ gridColumn: "span 2" }}>
            <Button
              type="submit"
              sx={{
                backgroundColor: "#04D1F1",
                color: "#F7FCFD",
                "&: hover": { backgroundColor: "#F7FCFD", color: "#04D1F1" },
              }}
            >
              <Typography>Post Review</Typography>
            </Button>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default Review;
