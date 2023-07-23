import { createContext, useContext, useReducer } from "react";
import { AuthContext } from "./AuthContext";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  const INITIAL_STATE = {
    chatId: "null",
    user: {},
    userChats: [], // Add userChats as part of the initial state
  };

  const chatReducer = (state, action) => {
    switch (action.type) {
      case "CHANGE_USER":
        const combinedId =
          currentUser.uid > action.payload.uid
            ? currentUser.uid + action.payload.uid
            : action.payload.uid + currentUser.uid;

        return {
          ...state,
          user: action.payload,
          chatId: combinedId,
        };

      case "SET_ACTIVE_CHAT":
        return {
          ...state,
          chatId: action.payload,
        };

      case "CHAT_DELETED":
        // Remove the deleted chat from userChats
        const updatedUserChats = state.userChats.filter(
          (chat) => chat.chatId !== action.payload
        );

        return {
          ...state,
          userChats: updatedUserChats,
        };

      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

  return (
    <ChatContext.Provider value={{ data: state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
};
