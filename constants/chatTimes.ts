export const formatChatTime = (date: Date | string | number) => {
    const messageDate = new Date(date);
    const now = new Date();

    const isToday =
        messageDate.toDateString() === now.toDateString();

    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);

    const isYesterday =
        messageDate.toDateString() === yesterday.toDateString();

    if (isToday) {
        return messageDate.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    }

    if (isYesterday) {
        return "Yesterday";
    }

    const diffDays =
        (now.getTime() - messageDate.getTime()) /
        (1000 * 60 * 60 * 24);

    if (diffDays < 7) {
        return messageDate.toLocaleDateString([], {
            weekday: "short",
        });
    }

    if (messageDate.getFullYear() === now.getFullYear()) {
        return messageDate.toLocaleDateString([], {
            month: "short",
            day: "numeric",
        });
    }

    return messageDate.toLocaleDateString([], {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};