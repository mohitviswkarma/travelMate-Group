package com.travelmate.repository.chat;

import com.travelmate.entity.Message;
import com.travelmate.config.HibernateConfig;
import org.hibernate.Session;
import org.hibernate.Transaction;
import java.util.List;
import java.util.UUID;

public class MessageDAO {

    public void saveMessage(Message message) {
        Transaction tx = null;
        try (Session session = HibernateConfig.getSessionFactory().openSession()) {
            tx = session.beginTransaction();
            session.persist(message);
            tx.commit();
        } catch (Exception e) {
            if (tx != null) tx.rollback();
            throw e;
        }
    }

    public List<Message> getConversationMessages(String conversationId, int offset, int limit) {
        try (Session session = HibernateConfig.getSessionFactory().openSession()) {
            return session.createQuery(
                    "FROM Message m WHERE m.conversationId = :cid ORDER BY m.createdAt DESC", Message.class)
                    .setParameter("cid", conversationId)
                    .setFirstResult(offset)
                    .setMaxResults(limit)
                    .list();
        }
    }
}