import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const Breadcrumbs = ({ crumbs }) => {
    return (
        <nav className="bg-gray-50 py-3">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <ol className="flex items-center space-x-2 text-sm text-gray-500">
                    {crumbs.map((crumb, index) => (
                        <li key={index} className="flex items-center">
                            {index > 0 && <ChevronRight size={16} className="mx-2 text-gray-400" />}
                            {crumb.link ? (
                                <Link to={crumb.link} className="hover:text-pink-600 hover:underline">
                                    {crumb.label}
                                </Link>
                            ) : (
                                <span className="font-semibold text-gray-700">{crumb.label}</span>
                            )}
                        </li>
                    ))}
                </ol>
            </div>
        </nav>
    );
};

export default Breadcrumbs;
