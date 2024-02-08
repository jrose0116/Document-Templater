import { useEffect, useState } from "react"
import { Template, Variable } from "../../types/types"

import xss from "xss";
import EditModal from "./EditModal";
import { firestore } from "../firebase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";

export interface Props {
    template: Template;
    refresh: boolean;
    setRefresh: (arg0: boolean)=>void;
}

const TemplateInterface = (props: Props) => {
    const [template, setTemplate] = useState<Template>(props.template || {name: "template", id: 0, text: "Hello this is template text", variables: []})
    const [editModal, setEditModal] = useState<boolean>(false)
    const [confirmDelete, setConfirmDelete] = useState<boolean>(false)

    const {refresh, setRefresh} = props

    const deleteTemplate = async () => {
        setConfirmDelete(false)
        const templateDoc = doc(firestore, "templates", template.id)

        try{
            await deleteDoc(templateDoc)
            toast.success("Successfully Deleted Template!")
            setRefresh(!refresh)
        } catch (e) {
            toast.error("Failed to Delete Template!")
        }
    }

    const updateVarText = (id: string, text: string) => {
        setTemplate((temp)=>({...temp, variables: temp.variables.map((variable)=>(variable.id === id) ? ({...variable, value: text}) : variable)}))
    }

    const clipboardAction = () => {
        const textElems = document.querySelectorAll('.templateInterfaceText p')
        if(textElems) {
            let copyString = ''
            textElems.forEach((p)=> {if (p instanceof HTMLParagraphElement) copyString += p.innerText + "\n"})
            navigator.clipboard.writeText(copyString.trim())
            toast.success("Copied Cover Letter To Clipboard!")
        }
    }

    const editTemplate = async (template: Template) => {
        const templateDoc = doc(firestore, "templates", template.id)

        try {
            await updateDoc(templateDoc, template)
            toast.success("Successfully Edited Template!")
            setRefresh(!refresh)
        } catch (e) {
            toast.error("Failed To Edit Template!")
        }
    }

    useEffect(()=>{setTemplate(props.template)}, [props.template])

    return <div className="templateInterface">
        <div className="templateInterfaceTitle">
            <div>
                {template.name || "Unnamed Template"}
            </div>
            <img src="/edit.svg" alt="Edit Template" className="templateInterfaceTitleEdit" onClick={()=>setEditModal(true)}/>
            <img src="/delete.svg" alt="Delete Template" className="templateInterfaceTitleDelete" onClick={()=>setConfirmDelete(true)}/>
        </div>
        <div>
        {editModal && <EditModal submit={(template: Template)=>editTemplate(template)} close={()=>setEditModal(false)} template={template} />}
        {confirmDelete && <div className="modalOverlay">
            <div className="confirmModal">
                <div className="modalHeader">
                    <h2>Delete Template</h2>
                </div>
                <p className="modalInfo">Are you sure you want to delete {template.name || "Unnamed Template"}</p>
                <div className="modalFooter">
                    <button onClick={()=>setConfirmDelete(false)}>Go Back</button>
                    <button onClick={()=>deleteTemplate()}>Delete Template</button>
                </div>
            </div>
      </div>}
        </div>
        <div className="templateInterfaceFlex">
            <div className="templateInterfaceText">
                {(template.text && template.text.split("\n").length != 0) ? template.text.split("\n").map((string: string, index: number)=>{
                for(const variable of template.variables) string = string.replace(`||${variable.name}||`, `<span style="color:${variable.color}">${xss(variable.value)}</span>`)
                return <p key={index} dangerouslySetInnerHTML={{__html: (string)}}></p>
                }) : ""}
                <img src="/clipboard.svg" alt="Copy to Clipboard" className="templateInterfaceTextCopy" onClick={()=>{clipboardAction()}}/>
            </div>
            <div className="templateInterfaceVariables">
                <div className="templateInterfaceVariablesHead"><div>Variables</div></div>
                <div className="templateInterfaceVariablesBody">
                    {template.variables ? template.variables.map((variable: Variable)=><div key={variable.id} className="templateInterfaceVariablesItem">
                        <div className="templateInterfaceVariablesItemTitle">{variable.name}</div>
                        <div><input type="text" value={(variable.value)} style={{color: variable.color}} onChange={(e)=>{updateVarText(variable.id, xss(e.target.value))}}/></div>
                    </div>) : <></>}
                </div>
            </div>
        </div>
        </div>
}

export default TemplateInterface