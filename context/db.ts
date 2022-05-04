import * as SQLite from "expo-sqlite";
import * as React from "react";
import { Platform } from "react-native";

function openDatabase() {
  if (Platform.OS === "web") {
    return {
      transaction: () => {
        return {
          executeSql: () => {},
        };
      },
    };
  }

  const db = SQLite.openDatabase("db.nhom16");
  return db;
}

export const db = openDatabase();
export const DBContext = React.createContext(db);
