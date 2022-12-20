import { useEffect, useState } from 'react'
import Chat from '../components/Chat'
import { toast } from 'react-toastify'
import Identicons from 'react-identicons'
import { useParams } from 'react-router-dom'
import Countdown from '../components/Countdown'
import { setGlobalState, truncate, useGlobalState } from '../store'
import {
  buyNFTItem,
  claimPrize,
  getBidders,
  loadAuction,
} from '../services/blockchain'
import { createNewGroup, getGroup, joinGroup } from '../services/chat'

const Nft = () => {
  const { id } = useParams()
  const [auction] = useGlobalState('auction')
  const [bidders] = useGlobalState('bidders')
  const [currentUser] = useGlobalState('currentUser')
  const [connectedAccount] = useGlobalState('connectedAccount')

  useEffect(async () => {
    await loadAuction(id)
    await getBidders(id)
    await getGroup(`pid_${id}`)
      .then((group) => setGlobalState('group', group))
      .catch((error) => console.log(error))
  }, [])

  return (
    <>
      <div
        className="grid sm:flex-row md:flex-row lg:grid-cols-2 gap-6
      md:gap-4 lg:gap-3 py-2.5 text-white font-sans capitalize
      w-4/5 mx-auto mt-5 justify-between items-center"
      >
        <div
          className=" text-white h-[400px] bg-gray-800 rounded-md shadow-xl 
        shadow-black md:w-4/5 md:items-center lg:w-4/5 md:mt-0"
        >
          <img
            src={auction?.image}
            alt={auction?.name}
            className="object-contain w-full h-80 mt-10"
          />
        </div>
        <div className="">
          <Details auction={auction} account={connectedAccount} />

          {bidders.length > 0 ? <Bidders /> : null}

          <CountdownNPrice auction={auction} />

          {currentUser ? (
            <ActionButton auction={auction} account={connectedAccount} />
          ) : null}
        </div>

        <Chat id={id} />
      </div>
    </>
  )
}

const Details = ({ auction, account }) => (
  <div className="py-2">
    <h1 className="font-bold text-lg mb-1">{auction?.name}</h1>
    <p className="font-semibold text-sm">
      <span className="text-green-500">
        @
        {auction?.owner == account
          ? 'you'
          : auction?.owner
          ? truncate(auction?.owner, 4, 4, 11)
          : ''}
      </span>
    </p>
    <p className="text-sm py-2">{auction?.description}</p>
  </div>
)

const Bidders = ({ bidders, auction }) => {
  const handlePrizeClaim = async () => {
    await toast.promise(
      new Promise(async (resolve, reject) => {
        await claimPrize({ tokenId, id })
          .then(() => resolve())
          .catch(() => reject())
      }),
      {
        pending: 'Processing...',
        success: 'Price claim successful, will reflect within 30sec 👌',
        error: 'Encountered error 🤯',
      },
    )
  }

  return (
    <div className="flex flex-col">
      <span>Top Bidders</span>
      <div className="h-[calc(100vh_-_40.5rem)] overflow-y-auto">
        {bidders.map((bid, i) => (
          <div className="flex justify-between items-center">
            <div className="flex justify-start items-center my-1 space-x-1">
              <Identicons
                className="h-5 w-5 object-contain bg-gray-800 rounded-full"
                size={18}
                string={bid.bidder}
              />
              <span className="font-medium text-sm mr-3">
                {truncate(bid.bidder, 4, 4, 11)}
              </span>
              <span className="text-green-400 font-medium text-sm">
                {bid.price} ETH
              </span>
            </div>

            {bid.bidder == auction.winner &&
            !bid.won &&
            Date.now() > timestamp ? (
              <button
                type="button"
                className="shadow-sm shadow-black text-white
            bg-green-500 hover:bg-green-700 md:text-xs p-1
              rounded-sm text-sm cursor-pointer font-light"
                onClick={handlePrizeClaim}
              >
                Claim Prize
              </button>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  )
}

const CountdownNPrice = (auction) => {
  return (
    <div className="flex justify-between items-center py-5 ">
      <div>
        <span className="font-bold">Current Price</span>
        <p className="text-sm font-light">{auction?.price}ETH</p>
      </div>

      <div className="lowercase">
        <span className="font-bold">
          {auction?.duration > Date.now() ? (
            <Countdown timestamp={auction?.duration} />
          ) : (
            '00:00:00'
          )}
        </span>
      </div>
    </div>
  )
}

const ActionButton = ({ auction, account }) => {
  const [group] = useGlobalState('group')

  const onPlaceBid = () => {
    setGlobalState('auction', auction)
    setGlobalState('bidBox', 'scale-100')
  }

  const handleNFTpurchase = async () => {
    await toast.promise(
      new Promise(async (resolve, reject) => {
        await buyNFTItem(auction)
          .then(() => resolve())
          .catch(() => reject())
      }),
      {
        pending: 'Processing...',
        success: 'Purchase successful, will reflect within 30sec 👌',
        error: 'Encountered error 🤯',
      },
    )
  }

  const handleCreateGroup = async () => {
    await toast.promise(
      new Promise(async (resolve, reject) => {
        await createNewGroup(`pid_${auction?.tokenId}`, auction?.name)
          .then((gp) => {
            setGlobalState('group', gp)
            resolve(gp)
          })
          .catch((error) => reject(new Error(error)))
      }),
      {
        pending: 'Creating...',
        success: 'Group created 👌',
        error: 'Encountered error 🤯',
      },
    )
  }

  const handleJoineGroup = async () => {
    await toast.promise(
      new Promise(async (resolve, reject) => {
        await joinGroup(`pid_${auction?.tokenId}`)
          .then((gp) => {
            setGlobalState('group', gp)
            resolve(gp)
          })
          .catch((error) => reject(new Error(error)))
      }),
      {
        pending: 'Joining...',
        success: 'Group Joined 👌',
        error: 'Encountered error 🤯',
      },
    )
  }

  return auction?.owner == account ? (
    <div className="flex justify-start items-center space-x-2 mt-2">
      {!group ? (
        <button
          type="button"
          className="shadow-sm shadow-black text-white
          bg-red-500 hover:bg-red-700 md:text-xs p-2.5
          rounded-sm cursor-pointer font-light"
          onClick={handleCreateGroup}
        >
          Create Group
        </button>
      ) : null}
    </div>
  ) : (
    <div className="flex justify-start items-center space-x-2 mt-2">
      {auction?.biddable ? (
        <>
          {auction?.live && auction?.duration > Date.now() ? (
            <button
              type="button"
              className="shadow-sm shadow-black text-white
              bg-gray-500 hover:bg-gray-700 md:text-xs p-2.5
                rounded-sm cursor-pointer font-light"
              onClick={onPlaceBid}
            >
              Place a Bid
            </button>
          ) : null}
        </>
      ) : (
        <>
          <button
            type="button"
            className="shadow-sm shadow-black text-white
          bg-red-500 hover:bg-red-700 md:text-xs p-2.5
            rounded-sm cursor-pointer font-light"
            onClick={handleNFTpurchase}
          >
            Buy NFT
          </button>
        </>
      )}

      {!group?.hasJoined ? (
        <button
          type="button"
          className="shadow-sm shadow-black text-white
          bg-gray-500 hover:bg-gray-700 md:text-xs p-2.5
          rounded-sm cursor-pointer font-light"
          onClick={handleJoineGroup}
        >
          Join Group
        </button>
      ) : null}
    </div>
  )
}

export default Nft
