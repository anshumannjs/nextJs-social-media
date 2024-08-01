"use client"
import Topbar from "@/components/TopBar"
import LeftSidebar from "@/components/LeftSideBar"
import Bottombar from "@/components/BottomBar"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Modal, useDisclosure, ModalContent, ModalHeader, ModalBody } from "@nextui-org/react"
import Notification from "@/components/Notification"
import { socket } from "../socket"

export default function Layout({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const session = useSession()
    const { isOpen, onOpen, onOpenChange } = useDisclosure()
    const [notification, setNotification] = useState<any[]>()
    useEffect(() => {
        if (session.status === "unauthenticated") {
            router.push("/")
        }
    }, [session])
    useEffect(() => {
        console.log(notification)
        if (!notification) {
            fetch(`${process.env.NEXT_PUBLIC_URL}/api/notification`).then((e) => e.json()).then((res) => {
                if (res.status === 200) {
                    if (res.notificationArr.length > 0) {
                        setNotification(res.notificationArr)
                    }
                }
            }).catch((err) => console.log(err))
        }
    }, [notification])
    socket.on(`${session.data?.user._id}`, (notificationObj) => {
        console.log(notificationObj)
        if (notification) notification.push(notificationObj);
        else setNotification([notificationObj])
    })

    return (
        <div className="w-full md:flex h-[100vh]">
            <Topbar />
            <LeftSidebar notification={isOpen} setNotification={onOpen} />
            {isOpen?
            <Notification
                onOpenChange={onOpenChange}
                onOpen={onOpen}
                isOpen={isOpen}
                notificationArr={notification}
                setNotificationArr={setNotification}
            />
            :""}
            <section className="flex flex-1 h-full">
                {children}
            </section>
            <Bottombar />
        </div>
    )
}