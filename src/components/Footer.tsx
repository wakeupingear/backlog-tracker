import React from 'react';
import { Separator } from './ui/separator';
import { SiGithub } from 'react-icons/si';

export default function Footer() {
    return (
        <footer className="flex justify-center items-center w-full pt-4 gap-4">
            <p>
                {new Date().getFullYear()}{' '}
                <a
                    href="https://abbyfarhat.com"
                    target="_blank"
                    rel="noreferrer"
                >
                    Abby Farhat
                </a>
            </p>
            <Separator orientation="vertical" className="h-6" />
            <p>
                <a
                    href="https://github.com/wakeupingear/what-do-i-play-next"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1"
                >
                    Contribute! <SiGithub className="inline" />
                </a>
            </p>
        </footer>
    );
}
