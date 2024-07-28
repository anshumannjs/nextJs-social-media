"use client"
import { INotificationSchema } from "@/database/schema/notification"
import { IUserSchema } from "@/database/schema/user"
import { IUserDetailsSchema } from "@/database/schema/userDetails"
import { ModalHeader, ModalBody, Tab, Tabs, Modal, ModalContent } from "@nextui-org/react"
import { Loader } from "lucide-react"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import Image, { ImageLoader } from "next/image"

// recipentArr: string[],
//     readUsers: string[],
//     unreadUsers: string[],
//     sender: string,
//     about: string,
//     link: string,
//     createdAt: Date,
//     senderName: string

function NotiFicationCard({ notificationObj }: { notificationObj: INotificationSchema, status: string }) {
  const [senderDetails, setSenderDetails]=useState<IUserSchema|null>(null)

  useEffect(() => {
    fetch("api/user", {
      method: "POST",
      body: JSON.stringify({ id: notificationObj.sender })
    }).then((e)=>e.json()).then((res: {status: number, user: IUserSchema, userDetails: IUserDetailsSchema})=>{
      setSenderDetails(res.user)
    }).catch((err)=>console.log(err))
  }, [])

  if (!senderDetails){
    return(
      <Loader />
    )
  }

  return (
    <div className="flex">
      <Image src={senderDetails?.image || ""} width={10} height={10} alt={"senderImage"} loader={Loader as ImageLoader}/>

      <div>
        {senderDetails.firstName} {notificationObj.about}
      </div>
    </div>
  )
}

export default function Notification({ isOpen, onOpen, onOpenChange }: { isOpen: boolean, onOpenChange: () => void, onOpen: () => void }) {
  const { data, status } = useSession()
  console.log(status)
  const [notificationData, setNotificationData] = useState<INotificationSchema[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    console.log("hello")
    if (status == "authenticated") {
      fetch("/api/notification").then((res) => res.json()).then((data: { status: number, notificationArr: INotificationSchema[] }) => {
        setNotificationData(data.notificationArr)
        setIsLoading(false)
      }).catch((err) => console.log(err))
    }
  }, [])
  if (isOpen){
    console.log("hello")
    if (status == "authenticated") {
      fetch("/api/notification").then((res) => res.json()).then((data: { status: number, notificationArr: INotificationSchema[] }) => {
        setNotificationData(data.notificationArr)
        setIsLoading(false)
      }).catch((err) => console.log(err))
    }
  }
  console.log(notificationData, isLoading)

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
                          notificationData?.filter((e)=>{return e.unreadUsers.includes(data?.user._id||"")}).map((value, index)=>{
                            return (
                              <NotiFicationCard notificationObj={value} status="unread"/>
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
