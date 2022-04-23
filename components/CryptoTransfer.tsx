import { View, Text } from "react-native";
import React from "react";

import { Dialog, Portal, Button, Caption, Title } from "react-native-paper";

type Props = {
  toggleCryptoDialog: boolean;
  setToggleCryptoDialog: (value: boolean) => void;
};

const CryptoTransfer = ({
  toggleCryptoDialog,
  setToggleCryptoDialog,
}: Props) => {
  return (
    <View>
      <Portal>
        <Dialog
          visible={toggleCryptoDialog}
          onDismiss={() => setToggleCryptoDialog(false)}
        >
          <Dialog.Title>100 D</Dialog.Title>
          <Dialog.Content>
            <View style={{ alignItems: "center" }}>
              <Title>Địa chỉ ví</Title>
              <Caption>#dasd67das</Caption>
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              mode="contained"
              onPress={() => setToggleCryptoDialog(false)}
            >
              Chuyển
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

export default CryptoTransfer;
