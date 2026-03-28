import { useState, useEffect } from 'react';
import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    orderBy,
    onSnapshot
} from 'firebase/firestore';
import { signInAnonymously } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { db, auth, APP_ID } from '../lib/firebase';
import type { Scenario } from '../types';

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((u) => {
            setUser(u);
            if (!u) {
                signInAnonymously(auth).catch(console.error);
            }
        });
        return unsubscribe;
    }, []);

    return user;
};

export const useScenarios = (user: User | null) => {
    const [scenarios, setScenarios] = useState<Scenario[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setScenarios([]);
            setLoading(false);
            return;
        }

        const q = query(
            collection(db, 'artifacts', APP_ID, 'users', user.uid, 'scenarios'),
            orderBy('updatedAt', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Scenario[];
            setScenarios(data);
            setLoading(false);
        }, (err) => {
            console.error("Firestore error:", err);
            setLoading(false);
        });

        return unsubscribe;
    }, [user]);

    const saveScenario = async (scenario: Omit<Scenario, 'id' | 'userId' | 'updatedAt'>, id?: string) => {
        if (!user) return;

        const data = {
            ...scenario,
            userId: user.uid,
            updatedAt: Date.now()
        };

        if (id) {
            await updateDoc(doc(db, 'artifacts', APP_ID, 'users', user.uid, 'scenarios', id), data);
        } else {
            await addDoc(collection(db, 'artifacts', APP_ID, 'users', user.uid, 'scenarios'), data);
        }
    };

    const deleteScenario = async (id: string) => {
        if (!user) return;
        await deleteDoc(doc(db, 'artifacts', APP_ID, 'users', user.uid, 'scenarios', id));
    };

    return { scenarios, loading, saveScenario, deleteScenario };
};
