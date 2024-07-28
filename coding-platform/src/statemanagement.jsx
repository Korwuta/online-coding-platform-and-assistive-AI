import {create} from 'zustand'
import {persist} from "zustand/middleware";

const useCode = create((set)=>({
    code:'',
    language:'',
    setCode: (value)=> set(()=>({code:value})),
    setLanguage: (value)=>set(()=>({language:value}))
}))
const useRequest = create(set=>({
    requests:[],
    setRequests: (request)=>set(state=>({requests:[...state.requests,request]}))
}))
const useUser = create(persist(
    set=>({
        user:{},
        setUser:(user)=>set({user:user})
    }),
    {
        name:'user',
        getStorage:()=>sessionStorage
    }
))
export {
    useCode,
    useRequest,
    useUser
}
