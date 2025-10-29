"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function NotFoundPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center bg-background text-foreground p-8">
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-6xl font-extrabold mb-4 text-primary"
            >
                404
            </motion.h1>

            <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-semibold mb-2"
            >
                Page not found
            </motion.h2>

            <p className="text-muted-foreground mb-8 max-w-md">
                Oops! The page you are looking for does not exist or has been
                moved.
            </p>

            <Link href="/">
                <Button size="lg" className="text-white">
                    Back to home
                </Button>
            </Link>
        </div>
    );
}
