import React from 'react';

const techs = [
    'HTML5', 'CSS3', 'JavaScript', 'TypeScript', 'React.js', 'Node.js',
    'Java', 'Spring Boot', 'Express JS', 'Django',
    'Django REST Framework', 'Python', 'AWS', 'Docker', 'TensorFlow',
    'MongoDB', 'Git/GitHub'
];

const Technologies = () => {
    return (
        <section className="py-20 bg-white border-t border-slate-100">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-3xl font-bold font-display text-slate-900 mb-12">
                    Technologies You'll Work With
                </h2>

                <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
                    {techs.map((tech, idx) => (
                        <span
                            key={idx}
                            className="bg-slate-50 text-slate-700 font-medium px-5 py-2.5 rounded-full border border-slate-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 transition-all cursor-default"
                        >
                            {tech}
                        </span>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Technologies;
