import { useCallback, useEffect, useRef, useState } from "react";
import api from "@/lib/apiClient";
import { getCaretCoordinates } from "@/utils/getCaretCoordinates";

const getMentionAtCursor = (text, cursorPos) => {
  const textBefore = text.slice(0, cursorPos);
  const match = textBefore.match(/@(\w*)$/);
  if (!match) return null;
  return { query: match[1], start: match.index, end: cursorPos };
};

const useMentions = (value, onChange, textareaRef) => {
  const [users, setUsers] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mentionRange, setMentionRange] = useState(null);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const searchTimeout = useRef(null);

  const isOpen = mentionRange !== null && users.length > 0;

  const updateMention = useCallback(
    (text, cursorPos) => {
      const mention = getMentionAtCursor(text, cursorPos);

      if (!mention) {
        setMentionRange(null);
        setUsers([]);
        return;
      }

      setMentionRange(mention);

      if (textareaRef.current) {
        const c = getCaretCoordinates(textareaRef.current, mention.start);
        const lineHeight =
          parseInt(window.getComputedStyle(textareaRef.current).lineHeight) ||
          20;
        setCoords({
          top: c.top - textareaRef.current.scrollTop + lineHeight,
          left: c.left,
        });
      }

      clearTimeout(searchTimeout.current);
      searchTimeout.current = setTimeout(async () => {
        try {
          const res = await api.get(`/users/search?q=${mention.query}`);
          setUsers(res.data.users || []);
          setSelectedIndex(0);
        } catch {
          setUsers([]);
        }
      }, 200);
    },
    [textareaRef],
  );

  const handleChange = useCallback(
    (e) => {
      onChange(e);
      updateMention(e.target.value, e.target.selectionStart);
    },
    [onChange, updateMention],
  );

  const selectUser = useCallback(
    (user) => {
      if (!mentionRange) return;
      const before = value.slice(0, mentionRange.start);
      const after = value.slice(mentionRange.end);
      const newValue = `${before}@${user.username} ${after}`;

      onChange({ target: { value: newValue } });
      setMentionRange(null);
      setUsers([]);

      // Restore focus and set cursor after inserted mention
      setTimeout(() => {
        if (textareaRef.current) {
          const newCursor = mentionRange.start + user.username.length + 2;
          textareaRef.current.focus();
          textareaRef.current.setSelectionRange(newCursor, newCursor);
        }
      }, 0);
    },
    [mentionRange, value, onChange, textareaRef],
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (!isOpen) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, users.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault();
        selectUser(users[selectedIndex]);
      } else if (e.key === "Escape") {
        setMentionRange(null);
        setUsers([]);
      }
    },
    [isOpen, users, selectedIndex, selectUser],
  );

  useEffect(() => {
    return () => clearTimeout(searchTimeout.current);
  }, []);

  return { isOpen, users, selectedIndex, coords, handleChange, handleKeyDown, selectUser };
};

export default useMentions;
