import { BrowserProvider, Contract, type Eip1193Provider } from "ethers";
import { GADGET_SALES_ABI } from "@/constants/GadgetSalesAbi";
import { requireContractAddress } from "@/constants/contract";

function getEthereumProvider(): Eip1193Provider {
  if (typeof window === "undefined") {
    throw new Error("GadgetSales contract access requires a browser wallet.");
  }

  const ethereum = (window as Window & { ethereum?: Eip1193Provider }).ethereum;
  if (!ethereum) {
    throw new Error("MetaMask is not available. Install a compatible wallet to continue.");
  }

  return ethereum;
}

function createBrowserProvider(): BrowserProvider {
  return new BrowserProvider(getEthereumProvider());
}

function createContract(connection: BrowserProvider | Awaited<ReturnType<BrowserProvider["getSigner"]>>) {
  return new Contract(requireContractAddress(), GADGET_SALES_ABI, connection);
}

export async function getReadOnlyContract(): Promise<Contract> {
  const provider = createBrowserProvider();
  return createContract(provider);
}

export async function getWritableContract(): Promise<Contract> {
  const provider = createBrowserProvider();
  const accounts = await provider.send("eth_accounts", []);

  if (accounts.length === 0) {
    throw new Error("No connected wallet found. Connect MetaMask before creating a sale.");
  }

  const signer = await provider.getSigner();
  return createContract(signer);
}
