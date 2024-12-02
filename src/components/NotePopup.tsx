import React, { useEffect, useRef, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from './ui/dialog';
import useAppStore from '~/store';
import { Textarea } from './ui/textarea';

type Props = {
    children: React.ReactNode;
};

export default function NotePopup({ children }: Props) {
    const setSelectedGame = useAppStore((state) => state.setSelectedGame);
    const gamesMetadata = useAppStore((state) => state.gamesMetadata);
    const updateMetadata = useAppStore((state) => state.updateMetadata);
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const selectedGame = useAppStore((state) => state.selectedGame);
    const lastSelectedGame = useRef(selectedGame);
    useEffect(() => {
        setOpen(Boolean(selectedGame));
        if (selectedGame) {
            setMessage(gamesMetadata[selectedGame.slug]?.message || '');
            lastSelectedGame.current = selectedGame;
        }
    }, [selectedGame, gamesMetadata]);
    const name = selectedGame?.name || lastSelectedGame.current?.name;

    return (
        <Dialog
            open={open}
            onOpenChange={(open) => {
                if (!open) {
                    if (selectedGame)
                        updateMetadata(selectedGame.slug, { message });
                    setSelectedGame(null);
                    setMessage('');
                }
            }}
        >
            {children}
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add a Note</DialogTitle>
                    {name && (
                        <DialogDescription>
                            Write a note about your experience with{' '}
                            <strong>{name}</strong>
                        </DialogDescription>
                    )}
                </DialogHeader>
                <Textarea
                    className="w-full h-24 p-2 rounded border"
                    placeholder="Did you like it? What did you think?"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
            </DialogContent>
        </Dialog>
    );
}
