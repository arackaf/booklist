import parseQueryString from "./lib/query-string";

import { gqlResponse, bookSyncTransform } from "./util";
import { fullSync, incrementalSync } from "./dataSync";
import { readTable, readBooks, getSyncInfo } from "./indexedDbDataAccess";
import { syncResultsFor, syncSubjectsResults } from "./incrementalSync";
import { getLibraryDatabase } from "./indexedDbUtil";

import searchBooksQuery from "../../graphQL/books/getBooks.graphql";
import allSubjects from "../../graphQL/subjects/allSubjects.graphql";
import allTags from "../../graphQL/tags/getTags.graphql";
import allLabelColors from "../../graphQL/misc/allLabelColors.graphql";

self.addEventListener("message", event => {
  if (event.data == "sw-update-accepted") {
    self.skipWaiting().then(() => {
      self.clients.claim().then(() => {
        self.clients.matchAll().then(clients => {
          clients.forEach(client => client.postMessage("sw-updated"));
        });
      });
    });
  }
});

self.addEventListener("push", () => {
  self.registration.showNotification("Push notification received!");
});

self.addEventListener("message", evt => {
  if (evt.data && evt.data.command == "do-sync") {
    masterSync(evt.data.userId);
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
  return fetch(request).then(response => {
    let respClone = response.clone();
    respClone.json().then(response => {
      syncResultsFor({ request, response }, "Book", bookSyncTransform);
      syncResultsFor({ request, response }, "Tag");
      syncSubjectsResults(response);
    });
    return response;
  });
}

function masterSync(userId) {
  const syncEvery = 1500 * 10; // 10 seconds

  getLibraryDatabase(async db => {
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
