import "core-js/actual"
// import { listen } from "@ledgerhq/logs";
// import AppBtc from "@ledgerhq/hw-app-btc";
import CosmosApp from "ledger-cosmos-js"

// Keep this import if you want to use a Ledger Nano S/X with the USB protocol and delete the @ledgerhq/hw-transport-webhid import
import TransportWebUSB from "@ledgerhq/hw-transport-webusb"
// Keep this import if you want to use a Ledger Nano S/X with the HID protocol and delete the @ledgerhq/hw-transport-webusb import
import TransportWebHID from "@ledgerhq/hw-transport-webhid"

//Display the header in the div which has the ID "main"
const initial =
  "<h1>Connect your Nano and open the Cosmos app.</h1><br><button id='button'>Connect Wallet</button><br><br>"
const $main = document.getElementById("main")
const path = [44, 118, 0, 0, 0]
$main.innerHTML = initial

document.getElementById("button").addEventListener("click", async () => {
  $main.innerHTML = initial
  try {
    //trying to connect to your Ledger device with USB protocol
    const transport = await TransportWebUSB.create(1000)

    //trying to connect to your Ledger device with HID protocol
    // const transport = await TransportWebHID.create();

    //listen to the events which are sent by the Ledger packages in order to debug the app
    // listen(log => console.log(log))

    //When the Ledger device connected it is trying to display the bitcoin address
    const appCosmos = new CosmosApp(transport)

    const response = await appCosmos.getAddressAndPubKey(path, "band")

    if (response.return_code !== 36864) {
      throw response
    } else {
      const h2 = document.createElement("h2")
      h2.textContent = response.bech32_address
      $main.innerHTML = "<h1>Your first Band address:</h1>"
      $main.appendChild(h2)
    }
    //Display the address on the Ledger device and ask to verify the address
    await appCosmos.getAddressAndPubKey(path, "band")
  } catch (e) {
    //Catch any error thrown and displays it on the screen
    const $err = document.createElement("code")
    $err.style.color = "#f66"
    $err.textContent = String(e.error_message || e)
    $main.appendChild($err)
  }
})
