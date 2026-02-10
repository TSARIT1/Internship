package com.tsarit.backend.controller;

import com.tsarit.backend.entity.Hackathon;
import com.tsarit.backend.repository.HackathonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hackathons")
@CrossOrigin(origins = "http://localhost:5173")
public class HackathonController {

    @Autowired
    private HackathonRepository hackathonRepository;

    @GetMapping
    public List<Hackathon> getAllHackathons() {
        return hackathonRepository.findAll();
    }

    @PostMapping
    public Hackathon createHackathon(@RequestBody Hackathon hackathon) {
        return hackathonRepository.save(hackathon);
    }
}
