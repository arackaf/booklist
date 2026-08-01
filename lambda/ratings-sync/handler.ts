export const hello = async (event: any) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Go Serverless v4.0! Your function executed successfully!"
    })
  };
};
