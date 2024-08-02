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
const useMessageStorage = create(persist(
    set=>({
        message:{},
        time:{},
        enable:{},
        start:{},
        setMessage: (message,accessToken)=>set(state=>({
            message:{...state.message,[accessToken]:message}
        })),
        setEnable: (isEnabled,accessToken)=>set(state=>({
            enable:{...state.enable,[accessToken]:isEnabled}
        })),
        setStart: (isEnabled,accessToken)=>set(state=>({
            start:{...state.start,[accessToken]:isEnabled}
        })),
        setTime: (time,accessToken)=>set(state=>({
            time:{...state.time,[accessToken]:time}
        }))
    }),
    {
        name:'message',
        getStorage:()=>sessionStorage
    }
))
export {
    useCode,
    useRequest,
    useUser,
    useMessageStorage

}
