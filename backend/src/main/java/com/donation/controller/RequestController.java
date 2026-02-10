package com.donation.controller;

import com.donation.dto.Dtos;
import com.donation.entity.Fulfillment;
import com.donation.entity.Request;
import com.donation.service.RequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requests")
public class RequestController {

    @Autowired
    private RequestService requestService;

    @PostMapping
    public ResponseEntity<Request> createRequest(@RequestBody Dtos.CreateRequestDto dto) {
        return ResponseEntity.ok(requestService.createRequest(dto));
    }

    @GetMapping
    public ResponseEntity<List<Request>> getAllRequests() {
        return ResponseEntity.ok(requestService.getAllRequests());
    }

    @GetMapping("/receiver/{userId}")
    public ResponseEntity<List<Request>> getRequestsByReceiver(@PathVariable Long userId) {
        return ResponseEntity.ok(requestService.getRequestsByReceiver(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Request> getRequest(@PathVariable Long id) {
        return ResponseEntity.ok(requestService.getRequest(id));
    }

    @PostMapping("/fulfill")
    public ResponseEntity<Fulfillment> fulfillRequest(@RequestBody Dtos.FulfillRequestDto dto) {
        return ResponseEntity.ok(requestService.fulfillRequest(dto));
    }
}
