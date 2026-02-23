import { useEffect, useState, useCallback, useRef } from 'react';
import { logTabSwitch } from '../services/antiCheatApi';

/**
 * useAntiCheat — Anti-cheating hook.
 *
 * @param {boolean} enabled      - Turn on/off the hook
 * @param {number}  studentId    - Logged-in student's ID (for DB logging)
 * @param {number}  hackathonId  - Current hackathon ID (for DB logging)
 */
const useAntiCheat = (enabled = true, studentId = null, hackathonId = null) => {
    const [tabSwitchCount, setTabSwitchCount] = useState(0);
    const [warningVisible, setWarningVisible] = useState(false);
    // Keep a ref to always have latest count available in event callbacks
    const countRef = useRef(0);

    const dismissWarning = useCallback(() => setWarningVisible(false), []);

    // Whenever tabSwitchCount changes, push to backend
    useEffect(() => {
        if (!enabled || tabSwitchCount === 0) return;
        if (studentId && hackathonId) {
            logTabSwitch(studentId, hackathonId, tabSwitchCount);
        }
    }, [tabSwitchCount, enabled, studentId, hackathonId]);

    useEffect(() => {
        if (!enabled) return;

        const opts = { capture: true, passive: false };

        // Block right-click / copy / cut / paste / selectstart
        const block = (e) => { e.preventDefault(); e.stopPropagation(); return false; };

        // Block keyboard shortcuts
        const handleKeyDown = (e) => {
            const ctrl = e.ctrlKey || e.metaKey;
            if (ctrl && ['c','x','v','a','u','s','p'].includes(e.key.toLowerCase())) {
                e.preventDefault(); e.stopPropagation(); return false;
            }
            if (e.key === 'F12') { e.preventDefault(); return false; }
            if (ctrl && e.shiftKey && ['i','j','c'].includes(e.key.toLowerCase())) {
                e.preventDefault(); return false;
            }
        };

        // Tab switch detection
        const recordSwitch = () => {
            countRef.current += 1;
            setTabSwitchCount(countRef.current);
            setWarningVisible(true);
        };

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') recordSwitch();
        };
        const handleBlur = () => {
            setTimeout(() => {
                if (!document.hasFocus()) recordSwitch();
            }, 200);
        };

        // Apply user-select: none directly on body
        const prev = {
            userSelect: document.body.style.userSelect,
            webkitUserSelect: document.body.style.webkitUserSelect,
        };
        document.body.style.userSelect = 'none';
        document.body.style.webkitUserSelect = 'none';

        document.addEventListener('contextmenu', block, opts);
        document.addEventListener('copy',        block, opts);
        document.addEventListener('cut',         block, opts);
        document.addEventListener('paste',       block, opts);
        document.addEventListener('selectstart', block, opts);
        document.addEventListener('keydown',     handleKeyDown, opts);
        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('blur', handleBlur);

        return () => {
            document.removeEventListener('contextmenu', block, opts);
            document.removeEventListener('copy',        block, opts);
            document.removeEventListener('cut',         block, opts);
            document.removeEventListener('paste',       block, opts);
            document.removeEventListener('selectstart', block, opts);
            document.removeEventListener('keydown',     handleKeyDown, opts);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('blur', handleBlur);
            document.body.style.userSelect = prev.userSelect;
            document.body.style.webkitUserSelect = prev.webkitUserSelect;
        };
    }, [enabled]);

    return { tabSwitchCount, warningVisible, dismissWarning };
};

export default useAntiCheat;
