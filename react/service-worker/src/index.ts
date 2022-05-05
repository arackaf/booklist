import parseQueryString from "./lib/query-string";

import { gqlResponse, bookSyncTransform } from "./util";
import { fullSync, incrementalSync } from "./dataSync";
import { readTable, readBooks, getSyncInfo } from "./indexedDbDataAccess";
import { syncResultsFor, syncSubjectsResults } from "./incrementalSync";
import { getLibraryDatabase } from "./indexedDbUtil";

import searchBooksQuery from "../../gql/books/getBooks.graphql";
import allSubjects from "../../gql/subjects/allSubjects.graphql";
import allTags from "../../gql/tags/getTags.graphql";
import allLabelColors from "../../gql/misc/allLabelColors.graphql";
import { updateSyncInfo, clearUserData } from "./indexedDbUpdateUtils";

self.addEventListener("push", () => {
  self.registration.showNotification("Push notification received!");
});

self.addEventListener("message", async evt => {
  if (evt.data && evt.data.command == "do-sync") {
    await updateSyncInfo({ currentUser: evt.data.userId });
    masterSync(evt.data.userId);
  }
});

self.addEventListener("message", async evt => {
  if (evt.data && evt.data.command == "login") {
    await updateSyncInfo({ currentUser: evt.data.userId });
    masterSync(evt.data.userId);
  }
});

self.addEventListener("message", async evt => {
  if (evt.data && evt.data.command == "logged-out") {
    await updateSyncInfo({ currentUser: null, usersSyncd: {} });
    await clearUserData();
  }
});

self.addEventListener("fetch", evt => {
  let req = evt.request.clone();

  if (/\bgraphql\b/.test(req.url)) {
    if (/get/i.test(req.method)) {
      return evt.respondWith(handleGraphqlGet(req));
    } else if (/post/i.test(req.method)) {
      return evt.respondWith(handleGraphqlPost(req));
    }
  }
});

function handleGraphqlGet(request) {
  return fetch(request).catch(err => {
    let search = request.url.split("?")[1];
    let { query, variables } = parseQueryString(search);

    if (query == allLabelColors) {
      return readTable("labelColors", "order").then(gqlResponse("allLabelColors", "LabelColors"));
    } else if (query == allSubjects) {
      return readTable("subjects", "name").then(gqlResponse("allSubjects", "Subjects"));
    } else if (query == allTags) {
      return readTable("tags", "name").then(gqlResponse("allTags", "Tags"));
    } else if (query == searchBooksQuery) {
      return readBooks(variables);
    }
  });
}

function handleGraphqlPost(request) {
  let reqClone = request.clone();
  return fetch(request).then(response => {
    console.log(reqClone);
    let respClone = response.clone();
    respClone.json().then(response => {
      syncResultsFor({ request: reqClone, response }, "Book", bookSyncTransform);
      syncResultsFor({ request: reqClone, response }, "Tag");
      syncSubjectsResults(response);
    });
    return response;
  });
}

function masterSync(userId) {
  const syncEvery = 1500 * 10; // 10 seconds

  getLibraryDatabase(async db => {
    await updateSyncInfo({ currentUser: userId });
    let syncInfo = await getSyncInfo();
    let syncPacket = syncInfo.usersSyncd[userId];

    if (syncPacket) {
      if (Date.now() - syncPacket.lastSync > syncEvery) {
        incrementalSync(userId, syncPacket.lastSync);
      }
    } else {
      fullSync(userId);
    }
  });
}
