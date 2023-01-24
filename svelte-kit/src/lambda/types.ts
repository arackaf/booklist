export type IndividualCoverResult = { STATUS: "success" | "invalid-size" | "error"; image?: { url: string; preview: string } };

export type CoverUploadResults =
  | {
      success: false;
      status: "invalid-size" | "error";
    }
  | {
      success: true;
      mobile: IndividualCoverResult;
      small: IndividualCoverResult;
      medium: IndividualCoverResult;
    };
