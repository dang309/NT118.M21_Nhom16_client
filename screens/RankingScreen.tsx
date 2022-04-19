import { StyleSheet } from "react-native";
import { useState, useEffect } from "react";

import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";
import { NavigationRankingProps } from "../types";

import { Button, IconButton, DataTable, Title } from "react-native-paper";

import * as RANKING_CONSTANT from "../constants/Ranking";

const numberOfItemsPerPageList = [2, 3, 4];

const items = [
  {
    key: 1,
    name: "Page 1",
  },
  {
    key: 2,
    name: "Page 2",
  },
  {
    key: 3,
    name: "Page 3",
  },
];

export default function RankingScreen() {
  const [currentTab, setCurrentTab] = useState<number>(0);
  const [tablePage, setTablePage] = useState(0);
  const [numberOfItemsPerPage, onItemsPerPageChange] = useState(
    numberOfItemsPerPageList[0]
  );
  const from = tablePage * numberOfItemsPerPage;
  const to = Math.min((tablePage + 1) * numberOfItemsPerPage, items.length);

  const getTabName = () => {
    switch (currentTab) {
      case 0:
        return RANKING_CONSTANT.LIKES;
      case 1:
        return RANKING_CONSTANT.SOUNDS;
      case 2:
        return RANKING_CONSTANT.HEARING;
    }
  };

  useEffect(() => {
    setTablePage(0);
  }, [numberOfItemsPerPage]);

  return (
    <View style={styles.container}>
      <View style={{ marginBottom: 16 }}>
        <Title>Bảng xếp hạng</Title>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          borderWidth: 1,
          borderColor: "#e5e5e5",
          padding: 8,
          borderRadius: 16,
          marginBottom: 16,
        }}
      >
        <View>
          {currentTab === 0 ? (
            <Button
              mode="contained"
              icon="heart-outline"
              onPress={() => setCurrentTab(0)}
              style={{ borderRadius: 32 }}
            >
              Thích
            </Button>
          ) : (
            <IconButton icon="heart-outline" onPress={() => setCurrentTab(0)} />
          )}
        </View>
        <View style={{ paddingHorizontal: 8 }}>
          {currentTab === 1 ? (
            <Button
              mode="contained"
              icon="musical-notes-outline"
              onPress={() => setCurrentTab(1)}
              style={{ borderRadius: 32 }}
            >
              Âm thanh
            </Button>
          ) : (
            <IconButton
              icon="musical-notes-outline"
              onPress={() => setCurrentTab(1)}
            />
          )}
        </View>
        <View>
          {currentTab === 2 ? (
            <Button
              mode="contained"
              icon="ear-outline"
              onPress={() => setCurrentTab(2)}
              style={{ borderRadius: 32 }}
            >
              Lượt nghe
            </Button>
          ) : (
            <IconButton icon="ear-outline" onPress={() => setCurrentTab(2)} />
          )}
        </View>
      </View>
      <DataTable>
        <DataTable.Header>
          <DataTable.Title>#</DataTable.Title>
          <DataTable.Title>{RANKING_CONSTANT.AVATAR}</DataTable.Title>
          <DataTable.Title>{RANKING_CONSTANT.NAME}</DataTable.Title>
          <DataTable.Title>{getTabName()}</DataTable.Title>
          <DataTable.Title>{RANKING_CONSTANT.DCOIN}</DataTable.Title>
        </DataTable.Header>

        <DataTable.Row>
          <DataTable.Cell>1</DataTable.Cell>
          <DataTable.Cell>159</DataTable.Cell>
          <DataTable.Cell>6.0</DataTable.Cell>
          <DataTable.Cell>6.0</DataTable.Cell>
          <DataTable.Cell>6.0</DataTable.Cell>
        </DataTable.Row>

        <DataTable.Row>
          <DataTable.Cell>2</DataTable.Cell>
          <DataTable.Cell>237</DataTable.Cell>
          <DataTable.Cell>8.0</DataTable.Cell>
          <DataTable.Cell>8.0</DataTable.Cell>
          <DataTable.Cell>8.0</DataTable.Cell>
        </DataTable.Row>

        <DataTable.Pagination
          page={tablePage}
          numberOfPages={Math.ceil(items.length / numberOfItemsPerPage)}
          onPageChange={(page) => setTablePage(page)}
          label={`${from + 1}-${to} of ${items.length}`}
          showFastPaginationControls
          numberOfItemsPerPage={numberOfItemsPerPage}
          onItemsPerPageChange={onItemsPerPageChange}
          selectPageDropdownLabel={"Rows per page"}
        />
      </DataTable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 4,
    paddingTop: 24,
  },
});
