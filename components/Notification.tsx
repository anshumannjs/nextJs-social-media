"use client"
import { INotificationSchema } from "@/database/schema/notification"
import { IUserSchema } from "@/database/schema/user"
import { IUserDetailsSchema } from "@/database/schema/userDetails"
import { ModalHeader, ModalBody, Tab, Tabs, Modal, ModalContent } from "@nextui-org/react"
import { Loader } from "lucide-react"
import { useSession } from "next-auth/react"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import Image, { ImageLoader } from "next/image"
import { socket } from "@/app/socket"

// recipentArr: string[],
//     readUsers: string[],
//     unreadUsers: string[],
//     sender: string,
//     about: string,
//     link: string,
//     createdAt: Date,
//     senderName: string

function NotiFicationCard({ notificationObj }: { notificationObj: INotificationSchema, status: string }) {
  const [senderDetails, setSenderDetails] = useState<IUserSchema | null>(null)

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_URL}/api/user`, {
      method: "POST",
      body: JSON.stringify({ id: notificationObj.sender })
    }).then((e) => e.json()).then((res: { status: number, user: IUserSchema, userDetails: IUserDetailsSchema }) => {
      setSenderDetails(res.user)
    }).catch((err) => console.log(err))
  }, [])
  console.log(senderDetails)

  if (!senderDetails) {
    return (
      <Loader />
    )
  }

  return (
    <div className="flex">
      <Image src={senderDetails?.image || ""} width={10} height={10} alt={"senderImage"} />

      <div>
        {senderDetails.firstName} {notificationObj.about}
      </div>
    </div>
  )
}

export default function Notification({
  isOpen,
  onOpen,
  onOpenChange,
  notificationArr,
  setNotificationArr
}: {
  isOpen: boolean,
  onOpenChange: () => void,
  onOpen: () => void,
  notificationArr: any[] | undefined,
  setNotificationArr: Dispatch<SetStateAction<any[] | undefined>>
}) {
  const { data, status } = useSession()
  console.log(data)
  const [notificationData, setNotificationData] = useState<INotificationSchema[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    console.log(notificationData, notificationArr)
    if (notificationArr) setNotificationData(notificationArr);
    else {
      console.log("fetching notifications")
      fetch(`${process.env.NEXT_PUBLIC_URL}/api/notification`).then((e) => e.json()).then((res) => {
        if (res.status === 200) {
          if (res.notificationArr.length > 0) {
            setNotificationData(res.notificationArr)
            setNotificationArr(res.notificationArr)
          }
        }
      }).catch((err) => console.log(err))
    }
  }, [notificationArr])
  // socket.on(`${data?.user._id}`, (notificationObj) => {
  //   console.log(notificationObj)
  //   if (notificationData) notificationData.push(notificationObj);
  //   else setNotificationData([notificationObj])
  // })

  notificationData?.filter((e) => { return e.unreadUsers.includes(data?.user._id || "") }).map((value, index) => {
    console.log("notification data here")
  })

  return (
    <div className="">
      {/* @ts-ignore */}
      <Modal className="fixed left-[-1%]" isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior={"inside"} backdrop={"transparent"}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Notification</ModalHeader>
              <ModalBody>
                {
                  isLoading ?
                    <Loader />
                    :
                    <>
                      {/* @ts-ignore */}
                      <Tabs size={"lg"} variant={"underlined"}>
                        <Tab title={"All"}>All</Tab>
                        <Tab title={"Unread"}>{
                          notificationData?.filter((e) => { return e.unreadUsers.includes(data?.user._id || "") }).map((value, index) => {
                            return (
                              <NotiFicationCard notificationObj={value} status="unread" />
                            )
                          })
                        }
                        </Tab>
                        <Tab title={"Read"}>[Read, hello, map]</Tab>
                      </Tabs>
                    </>
                }
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>

    </div>
  )
}
