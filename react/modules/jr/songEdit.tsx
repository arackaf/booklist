import React, { useRef, useState } from "react";

import styles from "./styles.module.css";
import ajaxUtil from "util/ajaxUtil";

const SongList = props => {
  const [songs, setSongs] = useState([]);
  const [searched, setSearched] = useState(false);
  const [searching, setSearching] = useState(false);
  const inputRef = useRef(null);

  const onUpdate = packet => {
    let song = songs.find(s => s._id == packet._id);
    if (!song) return;

    song.title = packet.title;
    if (packet.group) {
      delete song.singers;
      song.group = true;
    } else {
      song.singers = packet.singers;
      song.group = false;
    }

    setSongs(songs.concat());
  };

  const search = evt => {
    setSearching(true);
    evt.preventDefault();
    ajaxUtil.post("/songs/getSongs", { search: inputRef.current.value }).then(res => {
      setSongs(res.songs);
      setSearching(false);
      setSearched(true);
    });
  };

  return (
    <div style={{ paddingLeft: "10px" }}>
      <h1>Song Edit (Hi Carrie!)</h1>
      <form onSubmit={search}>
        <div className={styles.addForm}>
          <input placeholder="Search" ref={inputRef} className="form-control" style={{ width: "300px", marginRight: "5px" }} />
          <button disabled={searching} onClick={search} className="btn btn-primary margin-right">
            Go {searching ? <i className="fa fa-fw fa-spin fa-spinner" /> : null}
          </button>
        </div>
      </form>
      {songs.length ? (
        <table className={`table table-condensed margin-top ${styles.table}`} style={{ marginBottom: "20px" }}>
          <thead>
            <tr>
              <th style={{ width: "500px" }}>Title</th>
              <th style={{ width: "150px" }}>Group?</th>
              <th>Singers</th>
            </tr>
          </thead>
          <tbody>
            {songs.map(song => (
              <SongDisplay key={song._id} onUpdate={onUpdate} song={song} />
            ))}
          </tbody>
        </table>
      ) : searched ? (
        <h1>No Results</h1>
      ) : null}
    </div>
  );
};

const SongDisplay = props => {
  const [isEditing, setIsEditing] = useState(false);
  const { song, onUpdate } = props;

  const save = packet => {
    return ajaxUtil.post("/songs/updateSong", packet).then(resp => {
      onUpdate(packet);
      setIsEditing(false);
    });
  };

  return isEditing ? (
    <SongDisplayEditing save={save} cancel={() => setIsEditing(false)} song={song} />
  ) : (
    <SongDisplayNoEdit edit={() => setIsEditing(true)} song={song} />
  );
};

const SongDisplayNoEdit = props => {
  const { song, edit } = props;
  return (
    <tr>
      <td>
        <div className={styles.titleEdit}>
          {song.title}
          <a onClick={edit} style={{ marginLeft: "auto", marginRight: "20px" }}>
            <i className="fa fa-fw fa-pencil" />
          </a>
        </div>
      </td>
      <td>
        {song.group ? (
          <span style={{ color: "green", fontWeight: "bold" }}>
            <i className="fal fa-check" />
          </span>
        ) : null}
      </td>
      <td>{!song.group ? <span>{(song.singers || []).join(", ")}</span> : null}</td>
    </tr>
  );
};

const SongDisplayEditing = props => {
  const { song, cancel, save } = props;
  const titleRef = useRef(null);
  const [isGroup, setIsGroup] = useState(song.group);
  const [saving, setSaving] = useState(false);
  const singers = ["Jason", "Jordan", "Matt", "Michael", "Ray", "Rob", "Scotty"];
  const [currentSingers, setCurrentSingers] = useState(new Set(song.singers || []));

  const toggleSinger = singer => {
    currentSingers.has(singer) ? currentSingers.delete(singer) : currentSingers.add(singer);
    setCurrentSingers(new Set([...currentSingers]));
  };

  const runSave = () => {
    const packet = {
      _id: song._id,
      title: titleRef.current.value,
      group: !!isGroup,
      singers: [...currentSingers]
    };

    setSaving(true);
    save(packet).then(() => setSaving(false));
  };

  return (
    <tr>
      <td>
        <div className={styles.titleEdit}>
          <input ref={titleRef} style={{ width: "250px" }} className="form-control" defaultValue={song.title} />
          <span style={{ marginLeft: "auto", marginRight: "20px" }}>
            <button disabled={saving} onClick={runSave} className="btn btn-primary btn-xs margin-right">
              <i className="fa fa-fw fa-save" /> {saving ? <i className="fa fa-fw fa-spin fa-spinner" /> : null}
            </button>
            <a onClick={cancel}>Cancel</a>
          </span>
        </div>
      </td>
      <td style={{ verticalAlign: "middle" }}>
        <div style={{ display: "flex", alignItems: "center" }} className="checkbox">
          <label>
            <input onChange={evt => setIsGroup(evt.target.checked)} type="checkbox" checked={isGroup} /> Group?
          </label>
        </div>
      </td>
      <td style={{ verticalAlign: "middle" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          {!isGroup
            ? singers.map(singer => (
                <div className="checkbox" style={{ marginRight: "15px" }}>
                  <label>
                    <input onChange={() => toggleSinger(singer)} type="checkbox" checked={currentSingers.has(singer)} /> {singer}
                  </label>
                </div>
              ))
            : null}
        </div>
      </td>
    </tr>
  );
};

export default SongList;
