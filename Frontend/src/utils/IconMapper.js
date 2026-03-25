import {
    BookOpen, Code, Brain, Database, Cloud, Server, Coffee,
    Shield, Video, Globe, Lock, Tablet, Layout, Monitor,
    Cpu, Smartphone, Palette, Terminal, Layers, GitBranch,
    Zap, Box, FileCode, Rocket, Star, BarChart, Settings,
    Users, MessageSquare, Briefcase, Award, Target, Lightbulb,
    PenTool, Camera, Music, Heart, MapPin, Search, Home
} from 'lucide-react';

const iconMap = {
    BookOpen, Code, Brain, Database, Cloud, Server, Coffee,
    Shield, Video, Globe, Lock, Tablet, Layout, Monitor,
    Cpu, Smartphone, Palette, Terminal, Layers, GitBranch,
    Zap, Box, FileCode, Rocket, Star, BarChart, Settings,
    Users, MessageSquare, Briefcase, Award, Target, Lightbulb,
    PenTool, Camera, Music, Heart, MapPin, Search, Home
};

export const getIcon = (iconName) => {
    return iconMap[iconName] || BookOpen;
};
