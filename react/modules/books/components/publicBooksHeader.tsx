import React, { useContext } from "react";
import { AppContext } from "app/renderUI";

import getPublicUser from "graphQL/getPublicUser.graphql";
import { useQuery, buildQuery } from "micro-graphql-react";

export default () => {
  let [appState] = useContext(AppContext);

  let { isPublic, publicUserId } = appState;
  let { data, loaded } = useQuery(buildQuery(getPublicUser, { _id: publicUserId }));
  let publicUserInfo = data?.getPublicUser?.PublicUser;

  return loaded ? <HeaderContent {...publicUserInfo} /> : <i className="fa fa-fw fa-spin fa-spinner"></i>;
};

const HeaderContent = ({ publicBooksHeader, publicName }: any) => {
  let booksHeader = !publicBooksHeader && !publicName ? "User Not Found" : publicBooksHeader || `${publicName}'s Books`;

  return <h4 style={{ marginRight: "5px", marginBottom: 0, alignSelf: "center" }}>{booksHeader}</h4>;
};
