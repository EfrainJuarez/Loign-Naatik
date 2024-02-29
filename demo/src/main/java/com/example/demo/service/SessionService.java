package com.example.demo.service;

import com.example.demo.entity.SessionEntity;
import com.example.demo.entity.UserEntity;
import com.example.demo.repository.SessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class SessionService {
    private final SessionRepository sessionRepository;

    @Autowired
    public SessionService(SessionRepository sessionRepository) {
        this.sessionRepository = sessionRepository;
    }

    public SessionEntity iniciarSesion(UserEntity usuario) {
        SessionEntity nuevaSesion = new SessionEntity();
        nuevaSesion.setUser(usuario);
        nuevaSesion.setStartTime(LocalDateTime.now());
        nuevaSesion.setEndTime(null); // La sesión aún no ha finalizado
        return sessionRepository.save(nuevaSesion);
    }


    @Transactional
    public void finalizarSesion(SessionEntity sesion) {
        sesion.setEndTime(LocalDateTime.now());
        sessionRepository.save(sesion);
    }

    public List<SessionEntity> obtenerSesionesDeUsuario(UserEntity usuario) {
        return sessionRepository.findByUser(usuario);
    }

    public Optional<SessionEntity> getSessionById(Integer sessionId) {
        return sessionRepository.findById(sessionId);
    }

    public SessionEntity updateSession(SessionEntity session) {
        return sessionRepository.save(session);
    }

    // Otros métodos relacionados con la gestión de sesiones
}

