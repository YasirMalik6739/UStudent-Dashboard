import { Link } from 'react-router-dom';
import { ArrowLeft, Compass } from 'lucide-react';
import { Button } from '../components/ui/Button';
export function NotFoundPage() { return <div className="min-h-screen grid place-items-center p-5"><div className="text-center max-w-md"><div className="coming-soon-icon"><Compass size={30} /></div><p className="text-violet-700 font-semibold text-xs mb-2">404 · Page not found</p><h1 className="text-3xl font-semibold tracking-tight mb-3">This page seems to be missing.</h1><p className="text-sm text-slate-500 leading-7 mb-6">The address may be incorrect, or this route may not be available in the demo portal.</p><Link to="/dashboard"><Button icon={<ArrowLeft size={14} />}>Return to dashboard</Button></Link></div></div>; }
