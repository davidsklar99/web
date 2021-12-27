import { Card, Spinner } from "@blueprintjs/core";
import hyper from "@macrostrat/hyper";
import { connect } from "react-redux";
import { useAppActions } from "~/map-interface/app-state";

import { InfoDrawerHeader } from "./header";
import { FossilCollections } from "./fossil-collections";
import { GeologicMapInfo } from "./geo-map";
import { MacrostratLinkedData } from "./macrostrat-linked";
import { RegionalStratigraphy } from "./reg-strat";
import { Physiography } from "./physiography";
import { GddExpansion } from "./gdd";
import styles from "./main.module.styl";

const h = hyper.styled(styles);

function InfoDrawer(props) {
  const {
    mapHasBedrock,
    mapHasColumns,
    mapHasFossils,
    infoDrawerOpen,
    columnInfo,
    ...rest
  } = props;
  let { mapInfo, gddInfo, pbdbData } = rest;
  const runAction = useAppActions();

  const openGdd = () => {
    runAction({ type: "fetch-gdd" });
  };

  if (!mapInfo || !mapInfo.mapData) {
    return h("div");
  }

  let source =
    mapInfo && mapInfo.mapData && mapInfo.mapData.length
      ? mapInfo.mapData[0]
      : {
          name: null,
          descrip: null,
          comments: null,
          liths: [],
          b_int: {},
          t_int: {},
          ref: {},
        };

  if (!infoDrawerOpen) {
    return null;
  }
  return h("div.infodrawer-container", [
    h(Card, { className: "infodrawer" }, [
      h(InfoDrawerHeader, {
        mapInfo,
        infoMarkerLng: rest.infoMarkerLng,
        infoMarkerLat: rest.infoMarkerLat,
        onCloseClick: () => runAction({ type: "close-infodrawer" }),
      }),
      h("div.infodrawer-body", [
        h.if(rest.fetchingMapInfo)("div.spinner", [h(Spinner)]),
        h.if(!rest.fetchingMapInfo)("div", [
          h(FossilCollections, { data: pbdbData, expanded: true }),
          h(RegionalStratigraphy, { mapInfo, columnInfo }),
          h(GeologicMapInfo, {
            mapInfo,
            bedrockExpanded: true,
            source,
          }),
          h(MacrostratLinkedData, {
            mapInfo,
            bedrockMatchExpanded: true,
            source,
          }),
          h(Physiography, { mapInfo }),
          h(GddExpansion, {
            mapInfo,
            gddInfo,
            openGdd,
            fetchingGdd: rest.fetchingGdd,
          }),
        ]),
      ]),
    ]),
    h("div.spacer"),
  ]);
}

const mapStateToProps = (state) => {
  return {
    infoDrawerOpen: state.core.infoDrawerOpen,
    infoDrawerExpanded: state.core.infoDrawerExpanded,
    mapInfo: state.core.mapInfo,
    fetchingMapInfo: state.core.fetchingMapInfo,
    fetchingColumnInfo: state.core.fectchingColumnInfo,
    fetchingGdd: state.core.fetchingGdd,
    columnInfo: state.core.columnInfo,
    infoMarkerLng: state.core.infoMarkerLng,
    infoMarkerLat: state.core.infoMarkerLat,
    gddInfo: state.core.gddInfo,
    fetchingPbdb: state.core.fetchingPbdb,
    pbdbData: state.core.pbdbData,
    mapHasBedrock: state.core.mapHasBedrock,
    mapHasSatellite: state.core.mapHasSatellite,
    mapHasColumns: state.core.mapHasColumns,
    mapHasFossils: state.core.mapHasFossils,
  };
};

const InfoDrawerContainer = connect(mapStateToProps)(InfoDrawer);

export default InfoDrawerContainer;
