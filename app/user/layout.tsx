"use client"
import Topbar from "@/components/TopBar"
import LeftSidebar from "@/components/LeftSideBar"
import Bottombar from "@/components/BottomBar"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Modal, useDisclosure, ModalContent, ModalHeader, ModalBody } from "@nextui-org/react"
import Notification from "@/components/Notification"

export default function Layout({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const session = useSession()
    const { isOpen, onOpen, onOpenChange } = useDisclosure()
    const [notificationModal, setNotificationModal] = useState(false)
    useEffect(() => {
        if (session.status === "unauthenticated") {
            router.push("/")
        }
    }, [session])
    return (
        <div className="w-full md:flex h-[100vh]">
            <Topbar />
            <LeftSidebar notification={isOpen} setNotification={onOpen} />
            <Notification onOpenChange={onOpenChange} onOpen={onOpen} isOpen={isOpen}/>
            <section className="flex flex-1 h-full">
                {children}
            </section>
            <Bottombar />
        </div>
    )
}