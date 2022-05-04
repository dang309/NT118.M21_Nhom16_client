import REQUEST from "./request";

const getUserById = async (userId: string) => {
  try {
    let result;
    const res = await REQUEST({
      method: "GET",
      url: `/users/${userId}`,
    });

    if (res && res.data.result) {
      result = res.data.data;
    }

    return result;
  } catch (e) {
    console.error(e);
  }
};

export default { getUserById };
