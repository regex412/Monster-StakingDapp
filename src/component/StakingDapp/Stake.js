import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import config from "../../config/config";
import StakeNFTCard from "./NftCard";

import MONSTERDUDES_ABI from "../../assets/abis/MONSTERDUDES_ABI.json";
import PLUSHBABIES_ABI from "../../assets/abis/PLUSHBABIES_ABI.json";
import SPOOKYMONSTER_ABI from "../../assets/abis/SPOOKYMONSTER_ABI.json";

import { ClassicSpinner } from "react-spinners-kit";

const ethers = require("ethers");
const StakeComponent = ({ stakingContract }) => {
  const { account } = useWeb3React();
  const [unstakeArray, setUnstakeArray] = useState([]);
  const [getNftLoadingState, setGetNftLoadingState] = useState(true);

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const Signer = provider.getSigner();

  const nftCollectionArray = [
    {
      abi: MONSTERDUDES_ABI,
      contractAddr: config.MONSTERDUDES_ADDRESS,
      imgUrl: config.MONSTERDUDESIMGIPFS_ADDRESS,
    },
    {
      abi: PLUSHBABIES_ABI,
      contractAddr: config.PLUSHBABIES_ADDRESS,
      imgUrl: config.PLUSHBABIESIMGIPFS_ADDRESS,
    },
    {
      abi: SPOOKYMONSTER_ABI,
      contractAddr: config.SPOOKYMONSTER_ADDRESS,
      imgUrl: config.SPOOKYMONSTERIMGIPFS_ADDRESS,
    },
  ];
  // Get my Nft list from 3 Nft Contracts
  const getMyNftList = async () => {
    let nftArray = [];
    for (let i = 0; i < nftCollectionArray.length; i++) {
      const Contract = new ethers.Contract(
        nftCollectionArray[i].contractAddr,
        nftCollectionArray[i].abi,
        Signer
      );
      const nftArrayLength = await Contract.walletOfOwner(account);
      for (let j = 0; j < nftArrayLength.length; j++) {
        nftArray.push({
          tokenId: Number(nftArrayLength[j].toString()),
          contractAddr: nftCollectionArray[i].contractAddr,
          imgUrl:
            nftCollectionArray[i].imgUrl +
            "/" +
            Number(nftArrayLength[j].toString()) +
            ".png",
        });
      }
    }
    console.log(nftArray);
    setUnstakeArray(nftArray);
    setGetNftLoadingState(false);
  };

  useEffect(() => {
    if (account) {
      getMyNftList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 w-full">
      <div className="w-full">
        <div className="m-3 p-4 rounded-lg stakingList_content">
          <h1 className="font-bold mb-4 text-2xl text-center text-white">
            Unstaked NFT
          </h1>
          {account ? (
            <>
              {getNftLoadingState ? (
                <div className="flex justify-center w-full">
                  <ClassicSpinner size={30} />
                </div>
              ) : (
                <div className="gap-5 grid grid-cols-2 lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-3 w-full xl:grid-cols-3">
                  {unstakeArray.map((data, index) => (
                    <StakeNFTCard
                      key={index}
                      stakedState={false}
                      contractAddr={data.contractAddr}
                      imgUrl={data.imgUrl}
                      tokenId={data.tokenId}
                      stakeContract={stakingContract}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <h1 className="font-bold mt-20 text-center text-white">
              Please Connect Wallet ❗
            </h1>
          )}
        </div>
      </div>
      <div className="w-full">
        <div className="m-3 p-4 rounded-lg stakingList_content">
          <h1 className="font-bold mb-4 text-2xl text-center text-white">
            Staked NFT
          </h1>
          {account ? (
            <>
              {getNftLoadingState ? (
                <div className="flex justify-center w-full">
                  <ClassicSpinner size={30} />
                </div>
              ) : (
                <div className="w-full">
                  <div className="gap-5 grid grid-cols-2 lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-3 w-full xl:grid-cols-3">
                    <StakeNFTCard stakedState={true} />
                    <StakeNFTCard stakedState={true} />
                    <StakeNFTCard stakedState={true} />
                  </div>
                  <h1 className="font-bold mt-20 text-center text-white">
                    Nothing to Show ☹
                  </h1>
                </div>
              )}
            </>
          ) : (
            <h1 className="font-bold mt-20 text-center text-white">
              Please Connect Wallet ❗
            </h1>
          )}
        </div>
      </div>
    </div>
  );
};
export default StakeComponent;
