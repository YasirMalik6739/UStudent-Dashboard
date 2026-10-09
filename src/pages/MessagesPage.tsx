import { useMemo, useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Inbox, Mail, MailCheck, MailPlus, Search, Send } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { messageService } from '../services';
import type { StudentMessage } from '../types';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { EmptyState } from '../components/ui/EmptyState';
import { toast } from 'sonner';

const composeSchema = z.object({ subject: z.string().trim().min(3, 'Enter a subject.'), body: z.string().trim().min(8, 'Write a slightly longer message.') });
type ComposeValues = z.infer<typeof composeSchema>;
export function MessagesPage() {
  const [messages, setMessages] = useState<StudentMessage[]>(() => messageService.getAll()); const [folder, setFolder] = useState<'Inbox' | 'Unread' | 'Sent'>('Inbox'); const [query, setQuery] = useState(''); const [selectedId, setSelectedId] = useState<string | null>(null); const [composeOpen, setComposeOpen] = useState(false);
  const form = useForm<ComposeValues>({ resolver: zodResolver(composeSchema), defaultValues: { subject: '', body: '' } });
  const inbox = messages.filter(m => m.folder === 'Inbox'); const unreadCount = inbox.filter(m => !m.read).length; const sentCount = messages.filter(m => m.folder === 'Sent').length;
  const filtered = useMemo(() => messages.filter(m => folder === 'Unread' ? m.folder === 'Inbox' && !m.read : m.folder === folder).filter(m => `${m.sender} ${m.subject} ${m.preview}`.toLowerCase().includes(query.toLowerCase())), [messages, folder, query]);
  const selected = messages.find(m => m.id === selectedId);
  const openMessage = (message: StudentMessage) => { setSelectedId(message.id); if (!message.read) setMessages(messageService.markAsRead(message.id)); };
  const sendMessage = form.handleSubmit(values => { setMessages(messageService.send(values)); setFolder('Sent'); setSelectedId(null); setComposeOpen(false); form.reset(); toast.success('Message saved to demo Sent folder. It was not delivered.'); });
  return <>
    <PageHeader title="Messages" subtitle="Read sample academic notices and manage your demo inbox." actions={<Button icon={<MailPlus size={15} />} onClick={() => setComposeOpen(true)}>Compose message</Button>} />
    <div className="message-page-grid">
      <aside className="message-folder"><button className={`folder-btn ${folder === 'Inbox' ? 'active' : ''}`} onClick={() => { setFolder('Inbox'); setSelectedId(null); }}><Inbox size={16} /><span>Inbox</span><span className="folder-count">{unreadCount}</span></button><button className={`folder-btn ${folder === 'Unread' ? 'active' : ''}`} onClick={() => { setFolder('Unread'); setSelectedId(null); }}><Mail size={16} /><span>Unread</span><span className="folder-count">{unreadCount}</span></button><button className={`folder-btn ${folder === 'Sent' ? 'active' : ''}`} onClick={() => { setFolder('Sent'); setSelectedId(null); }}><Send size={16} /><span>Sent</span><span className="folder-count">{sentCount}</span></button><div className="divider" /><div className="inline-note px-2">Demo inbox · fictional senders and messages</div></aside>
      <section className="message-list-panel">
        {selected ? <div className="message-detail"><div className="flex items-center justify-between gap-3 mb-6"><Button variant="ghost" size="sm" icon={<ArrowLeft size={14} />} onClick={() => setSelectedId(null)}>Back to {folder.toLowerCase()}</Button><Button variant="ghost" size="sm" icon={<MailCheck size={14} />} onClick={() => { setMessages(messageService.markAsRead(selected.id)); toast.success('Marked as read.'); }}>Mark read</Button></div><div className="message-detail-top"><div className="message-avatar">{selected.avatar}</div><div className="min-w-0 flex-1"><h2 className="message-detail-title">{selected.subject}</h2><p className="message-detail-meta"><strong>{selected.sender}</strong> · {selected.senderRole}<br />{format(parseISO(selected.timestamp), 'EEEE, d MMMM yyyy · h:mm a')}</p></div></div><div className="message-body">{selected.body}</div><div className="callout-note"><Mail size={15} /><span>This is a fictional message for the UStudent frontend demo. No real email delivery occurs.</span></div></div> : <><div className="p-4 border-b border-slate-100 flex justify-between items-center gap-3"><div><h2 className="font-semibold text-sm">{folder === 'Unread' ? 'Unread messages' : folder}</h2><p className="muted text-[10px] mt-1">{filtered.length} message{filtered.length === 1 ? '' : 's'}</p></div><div className="flex items-center gap-2 border rounded-lg px-2.5 bg-white" style={{ borderColor: 'var(--border)', minHeight: 34, width: 'min(230px, 55%)' }}><Search size={13} className="muted" /><input className="outline-none text-[11px] py-2 w-full min-w-0" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search messages" aria-label="Search messages" /></div></div>
          {filtered.length ? filtered.map(message => <button key={message.id} className={`message-list-row ${!message.read ? 'unread' : ''}`} onClick={() => openMessage(message)}><div className="message-avatar">{message.avatar}</div><div className="message-list-copy"><div className="message-list-head"><strong>{message.sender}</strong><time>{format(parseISO(message.timestamp), 'd MMM')}</time></div><div className="message-list-subject">{message.subject}</div><div className="message-list-preview">{message.preview}</div></div>{!message.read && <span className="message-unread" />}</button>) : <EmptyState icon={<Mail size={21} />} title="No messages found" description="Try another search term or choose a different folder." />}</>}
      </section>
    </div>
    <div className="callout-note mt-4"><Star size={15} /><span>Academic Office, faculty, and department messages in this inbox are demo content, not official institutional communication.</span></div>
    <Modal open={composeOpen} onClose={() => setComposeOpen(false)} title="Compose demo message" size="md"><form onSubmit={sendMessage} className="space-y-4"><div className="form-field"><label className="field-label" htmlFor="compose-subject">Subject *</label><input id="compose-subject" className="field" placeholder="Message subject" {...form.register('subject')} />{form.formState.errors.subject && <p className="form-error">{form.formState.errors.subject.message}</p>}</div><div className="form-field"><label className="field-label" htmlFor="compose-body">Message *</label><textarea id="compose-body" className="textarea-field" placeholder="Write your message..." {...form.register('body')} />{form.formState.errors.body && <p className="form-error">{form.formState.errors.body.message}</p>}</div><p className="inline-note">Sending stores the message in this local demo's Sent folder only; it will not be delivered to any recipient.</p><div className="modal-actions"><Button variant="secondary" type="button" onClick={() => setComposeOpen(false)}>Cancel</Button><Button type="submit" icon={<Send size={14} />}>Save to Sent</Button></div></form></Modal>
  </>;
}
