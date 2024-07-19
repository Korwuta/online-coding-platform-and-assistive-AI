import {create} from 'zustand'
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
const useUser = create(set=>({
    user:{},
    setUser:(user)=>set({user:user})
}))
export {
    useCode,
    useRequest,
    useUser
}
