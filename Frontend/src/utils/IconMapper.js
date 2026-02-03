import * as Icons from 'lucide-react';

export const getIcon = (iconName) => {
    const IconComponent = Icons[iconName] || Icons.BookOpen; // Default to BookOpen if not found
    return IconComponent;
};
