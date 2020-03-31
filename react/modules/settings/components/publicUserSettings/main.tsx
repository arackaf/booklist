import React, { FunctionComponent, useContext, useState, useRef } from "react";
import { SectionLoading } from "app/components/loading";
import { ActionButton } from "app/components/ui/Button";

import PublicUserSettingsQuery from "graphQL/settings/getPublisUserSettingsQuery.graphql";
import UpdatePublisUserSettingsMutation from "graphQL/settings/updatePublicUserSettings.graphql";
import { useSuspenseQuery, buildQuery, useMutation, buildMutation } from "micro-graphql-react";
import { AppContext } from "app/renderUI";
import { QueryOf, Queries, MutationOf, Mutations } from "graphql-typings";
import FlexRow from "app/components/layout/FlexRow";
import Stack from "app/components/layout/Stack";

import cn from "classnames";
import { Form, Input } from "app/components/ui/Form";

const PublicUserSettings: FunctionComponent<{}> = props => {
  const [{ online }] = useContext(AppContext);
  const { loading, loaded, data } = useSuspenseQuery<QueryOf<Queries["getUser"]>>(buildQuery(PublicUserSettingsQuery, {}, { active: online }));

  if (!online) {
    return <h1>Offline</h1>;
  }

  return (
    <div>
      <FlexRow>
        <div className="col-md-6 col-sm-12" style={{ position: "relative", minHeight: "200px" }}>
          {!loaded ? <SectionLoading style={{ left: "20%" }} /> : <EditPublicUserSettings settings={data.getUser.User} />}
        </div>
      </FlexRow>
    </div>
  );
};

interface UserSettings {
  isPublic: boolean;
  publicBooksHeader: string;
  publicName: string;
}

const EditPublicUserSettings: FunctionComponent<{ settings: UserSettings }> = props => {
  const [app] = useContext(AppContext);
  const { runMutation, running: saving } = useMutation<MutationOf<Mutations["updateUser"]>>(buildMutation(UpdatePublisUserSettingsMutation));
  const { settings } = props;
  const { publicBooksHeader, publicName } = settings;
  const [pendingIsPublic, setPendingIsPublic] = useState(settings.isPublic);
  const [isPublic, setIsPublic] = useState(settings.isPublic);

  const [nameMissing, setNameMissing] = useState(false);

  const publicLink = isPublic ? `http://${window.location.host}/view?userId=${app.userId}` : "";

  const pubNameEl = useRef(null);
  const pubHeaderEl = useRef(null);

  const update = () => {
    if (!pubNameEl.current.value.trim()) {
      return setNameMissing(true);
    } else {
      setNameMissing(false);
    }

    let isPublic = pendingIsPublic;
    return runMutation({
      isPublic: pendingIsPublic,
      publicBooksHeader: pubHeaderEl.current ? pubHeaderEl.current.value : "",
      publicName: pubNameEl.current ? pubNameEl.current.value : ""
    }).then(() => {
      setIsPublic(isPublic);
    });
  };

  return (
    <Stack looser={true}>
      {publicLink ? (
        <div>
          Your collection is currently public, viewable{" "}
          <a target="_blank" href={publicLink}>
            here
          </a>
        </div>
      ) : null}

      <hr style={{ width: "100%" }} />

      <div className="checkbox-group">
        <label className="checkbox">
          Allow your book collection to be viewed publicly?
          <input
            onChange={evt => {
              setPendingIsPublic(evt.target.checked);
            }}
            defaultChecked={pendingIsPublic}
            disabled={saving}
            style={{ marginLeft: "5px" }}
            type="checkbox"
          />
        </label>
      </div>
      <div style={{ marginLeft: "20px" }}>
        <Form submit={update}>
          <FlexRow>
            {pendingIsPublic ? (
              <>
                <div className="col-xs-12">
                  <div className="form-group">
                    <label>Publicly display your name as</label>
                    <Input
                      ref={pubNameEl}
                      onChange={() => setNameMissing(false)}
                      defaultValue={publicName}
                      disabled={saving}
                      className={cn("form-control", { error: nameMissing })}
                      placeholder="Public name"
                    />
                  </div>
                </div>
                <div className="col-xs-12">
                  <div className="form-group">
                    <label>Publicly display your collection as</label>
                    <input ref={pubHeaderEl} defaultValue={publicBooksHeader} disabled={saving} className="form-control" placeholder="Book header" />
                  </div>
                </div>
              </>
            ) : null}
            <div className="col-xs-12">
              <ActionButton style={{ minWidth: "10ch" }} onClick={update} text="Save" runningText="Saving" finishedText="Saved" preset="primary" />
            </div>
          </FlexRow>
        </Form>
      </div>
    </Stack>
  );
};

export default PublicUserSettings;
