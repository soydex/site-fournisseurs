"use client";

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Home, ArrowLeft, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '../components/ui/FormElements';

const NotFoundPage: React.FC = () => {
    const router = useRouter();

    // Background animation variants
    const blobVariants: Variants = {
        animate: {
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.3, 0.5, 0.3],
            transition: {
                duration: 15,
                repeat: Infinity,
                ease: "linear"
            }
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-slate-50 selection:bg-comy-red selection:text-white">

            {/* --- Animated Background Elements --- */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Red Glow Top Left */}
                <motion.div
                    variants={blobVariants}
                    animate="animate"
                    className="absolute -top-[20%] -left-[10%] w-[800px] h-[800px] bg-red-500/10 rounded-full blur-[120px]"
                />

                {/* Dark Glow Bottom Right */}
                <motion.div
                    variants={blobVariants}
                    animate="animate"
                    transition={{ duration: 20, delay: 2 }}
                    className="absolute -bottom-[20%] -right-[10%] w-[600px] h-[600px] bg-slate-900/5 rounded-full blur-[100px]"
                />

                {/* Accent Center */}
                <motion.div
                    animate={{
                        y: [-20, 20, -20],
                        opacity: [0.4, 0.7, 0.4]
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[400px] bg-gradient-to-tr from-red-100/30 to-slate-200/30 rounded-full blur-[80px] rotate-[-15deg]"
                />
            </div>

            {/* --- Main Content Card --- */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative z-10 w-full max-w-2xl px-6"
            >
                <div className="glass-panel p-10 md:p-14 rounded-[2.5rem] shadow-2xl border border-white/80 relative overflow-hidden group">

                    {/* Decorative shine effect on hover */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/40 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none transform -translate-x-full group-hover:animate-shine" />

                    <div className="relative z-10 flex flex-col items-center text-center">

                        {/* 404 Typography */}
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.8, type: "spring" }}
                            className="relative mb-6"
                        >
                            <h1 className="text-[120px] md:text-[180px] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-slate-900 to-slate-600 drop-shadow-sm select-none">
                                404
                            </h1>
                            <motion.div
                                animate={{ rotate: [0, 5, -5, 0] }}
                                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                                className="absolute -top-4 -right-8 md:-right-12 bg-white p-3 rounded-2xl shadow-lg border border-slate-100 rotate-12"
                            >
                                <span className="text-4xl">🤔</span>
                            </motion.div>
                        </motion.div>

                        {/* Text Content */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
                                Oups ! Cette page s'est volatilisée.
                            </h2>
                            <p className="text-slate-500 text-lg md:text-xl max-w-md mx-auto mb-10 leading-relaxed font-medium">
                                Il semble que vous ayez atteint une impasse. La page que vous cherchez n'existe pas ou a été déplacée.
                            </p>
                        </motion.div>

                        {/* Action Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="flex flex-col sm:flex-row gap-4 w-full justify-center items-center"
                        >
                            <Button
                                variant="secondary"
                                onClick={() => router.back()}
                                className="w-full sm:w-auto min-w-[140px] !py-3 !text-base shadow-sm hover:shadow-md transition-all active:scale-95"
                            >
                                <ArrowLeft className="mr-2 h-5 w-5" />
                                Retour
                            </Button>

                            <Button
                                onClick={() => router.push('/')}
                                className="w-full sm:w-auto min-w-[140px] !py-3 !text-base bg-comy-red hover:bg-red-700 text-white shadow-lg shadow-red-500/20 hover:shadow-red-500/40 transition-all active:scale-95"
                            >
                                <Home className="mr-2 h-5 w-5" />
                                Accueil
                            </Button>
                        </motion.div>

                    </div>
                </div>

                {/* Footer Links (Optional decorative) */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="mt-8 text-center"
                >
                    <p className="text-slate-400 text-sm font-medium">
                        Besoin d'aide ? <span className="text-comy-red cursor-pointer hover:underline underline-offset-2">Contactez le support</span>
                    </p>
                </motion.div>

            </motion.div>
        </div>
    );
};

export default NotFoundPage;
