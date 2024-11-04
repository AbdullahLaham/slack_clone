import {useQueryState} from 'nuqs';

// const [parentMessageId, setParentMessageId] = useState(null);

export const useParentMessageId = () => {
    return useQueryState("parentMessageId");
}
