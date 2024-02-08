import { useEffect, useState } from "react"
import TemplateInterface from "./TemplateInterface"
import { Template } from '../../types/types'
import { JwtPayload, jwtDecode } from "jwt-decode"
import { addDoc, collection, getDocs, query, where } from "firebase/firestore"
import {firestore} from "../firebase.js"
import CreateModal from "./CreateModal.js"
import { toast } from "react-toastify"

interface EmailJwtPayload extends JwtPayload {
    email: string;
}

const AppFlex = () => {
    const [loading, setLoading] = useState<boolean>(true)
    const [currId, setCurrId] = useState<string>("0")
    const [email, setEmail] = useState<string>("")
    const [createModal, setCreateModal] = useState<boolean>(false)
    const [refresh, setRefresh] = useState<boolean>(false)
    const [templateList, setTemplateList] = useState<Template[]>()

    const handleSwitch = (id: string) => {
        setCurrId((prevId) => (id !== prevId ? id : prevId));
    }

    const createTemplate = async (template: Template) => {
        try {
            const templatesCollection = collection(firestore, "templates")
            const docRef = await addDoc(templatesCollection, template)
            if(docRef?.id) setCurrId(docRef.id)
            toast.success("Template Created!")
            setRefresh(!refresh)
        }catch(e){
            toast.error("Failed to create template!")
        }
    }

    useEffect(()=>{
        const fetchData = async ()=> {
            const token = localStorage.getItem("accessToken")
            if(token) {
                const decodedInfo = jwtDecode<EmailJwtPayload>(token)
                if (decodedInfo?.email) {
                    if (decodedInfo.email != email) {
                        // toast.success(`Successfully Signed In ${decodedInfo}`)
                        setEmail(decodedInfo.email)
                    }
                    const templatesCollection = collection(firestore, "templates")
                    const userQuery = query(templatesCollection, where("email", "==", email))
                    const snapshot = await getDocs(userQuery)

                    let found = false
                    if(snapshot.docs.length != 0) {
                        const tempList = snapshot.docs.map((doc)=>{
                            const temp = (doc.data())
                            if(doc.id == currId) found = true
                            return ({
                            id: doc.id,
                            name: temp.name,
                            text: temp.text,
                            email: temp.email,
                            variables: temp.variables
                        })}) as Template[]

                        setTemplateList(tempList)
                        if(tempList.length != 0 && currId != "0" && !found) setCurrId(tempList[0].id)
                    }
                    else {
                        setTemplateList([])
                        setCurrId("0")
                    }
                    setLoading(false)
                }
            }
        }
        fetchData()
    }, [email, refresh])

    if(loading) return <>
    <h1>Loading...</h1>
    </>

    return <div className="appFlex">
        <div className="templateSelector">
            {
                templateList && templateList.map((template: Template)=><div key={template.id} className={`templateSelectorItem ${(currId == template.id) ? "activeItem" : ""}`} onClick={()=>{handleSwitch(template.id)}}><div>{template.name || "Unnamed Template"}</div></div>)
            }
            <div key="create" className="templateSelectorItem createItem" onClick={()=>setCreateModal(true)}><div>Create New Template</div></div>
        </div>
        {templateList && templateList.length > 0 && <TemplateInterface template={templateList.find((temp)=>temp.id == currId) || templateList[0]} refresh={refresh} setRefresh={setRefresh} />}
        {createModal && <CreateModal submit={(template: Template)=>createTemplate(template)} close={()=>setCreateModal(false)} userEmail={email} />}
    </div>
}

export default AppFlex