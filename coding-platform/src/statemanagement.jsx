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
        user:null,
        setUser:(user)=>set({user:user}),
        setDisplayName:(displayName)=>set(state=>({
            user:{...state.user,displayName}
        })),
        setUserImage:(image)=>set(state=>({
            user:{...state.user,profileImage:image}
        }))
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
        thosePlaying:{},
        openCompletionDialog:{},
        leaveTime:{},
        endDetail:{},
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
        })),
        setThosePlaying: (people,accessToken)=>set(state=>({
            thosePlaying:{...state.thosePlaying,[accessToken]:people}
        })),
        setOpenCompletionDialog:(bool,accessToken)=>set(state=>({
            openCompletionDialog:{...state.openCompletionDialog,[accessToken]:bool}
        })),
        setLeaveTime:(value,accessToken)=>set(state=>({
            leaveTime:{...state.leaveTime,[accessToken]:value}
        })),
        setEndDetail:(value,accessToken)=>set(state=>({
            endDetail:{...state.endDetail,[accessToken]:value}
        }))
    }),
    {
        name:'message',
        getStorage:()=>sessionStorage
    }
))
const useJourneyStorage = create(persist(
    set=>({
        selectedTopic:{},
        setSelectedTopic:(topic,language)=>set(state=>({
            selectedTopic:{...state,[language]:topic}
        }))
    }),
    {
        name:'journey',
        getStorage:()=>localStorage
    }
))
const useQuestionStorage = create(
    set=>({
        score:{},
        setScore:(score,userId)=>set(state=>({
            score:{...state.score,[userId]:score}
        })),
        total:{},
        setTotal:(total,userId)=>set(state=>({
            total:{...state.total,[userId]:total}
        })),
    }),
)
export {
    useCode,
    useRequest,
    useUser,
    useMessageStorage,
    useJourneyStorage,
    useQuestionStorage
}
