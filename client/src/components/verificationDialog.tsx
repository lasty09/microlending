import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Alert,
  LinearProgress,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useState } from "react";

interface VerificationDialogProps {
  open: boolean;
  onClose: () => void;
  walletAddress: string;
  isVerified: boolean;
}

export default function VerificationDialog({
  open,
  onClose,
  walletAddress,
  isVerified,
}: VerificationDialogProps) {
  const [studentId, setStudentId] = useState("");
  const [institution, setInstitution] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = () => {
    // Validate all fields
    if (!studentId.trim()) {
      alert("Please enter your Student ID");
      return;
    }

    if (!institution.trim()) {
      alert("Please enter your Institution name");
      return;
    }

    if (!file) {
      alert("Please upload your Student ID or proof of enrollment");
      return;
    }

    setSubmitting(true);

    // Store verification request in localStorage
    const verificationData = {
      walletAddress,
      studentId: studentId.trim(),
      institution: institution.trim(),
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      timestamp: new Date().toISOString(),
      status: "pending",
    };

    // Convert file to base64 for localStorage
    const reader = new FileReader();
    reader.onload = () => {
      const base64File = reader.result as string;
      localStorage.setItem(
        `verification_${walletAddress}`,
        JSON.stringify({
          ...verificationData,
          fileData: base64File,
        })
      );

      // Simulate upload delay
      setTimeout(() => {
        setSubmitting(false);
        setSuccess(true);
      }, 1500);
    };
    reader.readAsDataURL(file);
  };

  const handleClose = () => {
    if (!submitting) {
      setStudentId("");
      setInstitution("");
      setFile(null);
      setSuccess(false);
      onClose();
    }
  };

  if (isVerified) {
    return (
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
            borderRadius: 4,
            border: "1px solid rgba(16, 185, 129, 0.3)",
          },
        }}
      >
        <DialogTitle sx={{ color: "white", fontWeight: 700 }}>
          Already Verified ✓
        </DialogTitle>
        <DialogContent>
          <Alert
            severity="success"
            sx={{
              borderRadius: 2,
              backgroundColor: "rgba(16, 185, 129, 0.1)",
              border: "1px solid rgba(16, 185, 129, 0.3)",
            }}
          >
            Your account is already verified as a student. You can now apply for
            loans!
          </Alert>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={handleClose}
            variant="contained"
            sx={{
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              fontWeight: 600,
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  if (success) {
    return (
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
            borderRadius: 4,
            border: "1px solid rgba(16, 185, 129, 0.3)",
          },
        }}
      >
        <DialogTitle sx={{ color: "white", fontWeight: 700 }}>
          Verification Request Submitted! 🎉
        </DialogTitle>
        <DialogContent>
          <Alert
            icon={<CheckCircleIcon />}
            severity="success"
            sx={{
              mb: 3,
              borderRadius: 2,
              backgroundColor: "rgba(16, 185, 129, 0.1)",
              border: "1px solid rgba(16, 185, 129, 0.3)",
            }}
          >
            Your verification request has been submitted successfully!
          </Alert>

          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.9)", mb: 2 }}>
            <strong>Next Steps:</strong>
          </Typography>

          <Box component="ul" sx={{ color: "rgba(255,255,255,0.7)", pl: 2 }}>
            <li>
              Share your wallet address with the admin:
              <Box
                component="code"
                sx={{
                  display: "block",
                  mt: 1,
                  p: 1,
                  bgcolor: "rgba(0,0,0,0.3)",
                  borderRadius: 1,
                  fontSize: "0.85rem",
                  wordBreak: "break-all",
                }}
              >
                {walletAddress}
              </Box>
            </li>
            <li>Admin will review your documents (usually within 24 hours)</li>
            <li>Once approved, you'll see a green "✓ Verified Student" badge</li>
            <li>Then you can apply for loans immediately!</li>
          </Box>

          <Alert
            severity="info"
            sx={{
              mt: 3,
              borderRadius: 2,
              backgroundColor: "rgba(99, 102, 241, 0.1)",
              border: "1px solid rgba(99, 102, 241, 0.3)",
            }}
          >
            <Typography variant="body2">
              Contact admin via email or WhatsApp with your wallet address to speed
              up the verification process.
            </Typography>
          </Alert>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={handleClose}
            variant="contained"
            sx={{
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              fontWeight: 600,
            }}
          >
            Done
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
          borderRadius: 4,
          border: "1px solid rgba(249, 115, 22, 0.2)",
        },
      }}
    >
      <DialogTitle sx={{ color: "white", fontWeight: 700, fontSize: "1.5rem" }}>
        Request Student Verification
      </DialogTitle>
      <DialogContent>
        <Typography
          variant="body2"
          sx={{ color: "rgba(255,255,255,0.7)", mb: 3, mt: 1 }}
        >
          Upload your student ID or proof of enrollment to get verified and start
          borrowing.
        </Typography>

        <TextField
          fullWidth
          label="Student ID / Registration Number"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          placeholder="e.g., 2021-01-1234"
          disabled={submitting}
          sx={{
            mb: 2,
            "& .MuiOutlinedInput-root": {
              color: "white",
              "& fieldset": { borderColor: "rgba(249, 115, 22, 0.3)" },
              "&:hover fieldset": { borderColor: "rgba(249, 115, 22, 0.5)" },
              "&.Mui-focused fieldset": { borderColor: "#f97316" },
            },
            "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.6)" },
          }}
        />

        <TextField
          fullWidth
          label="Institution Name"
          value={institution}
          onChange={(e) => setInstitution(e.target.value)}
          placeholder="e.g., University of Nairobi"
          disabled={submitting}
          sx={{
            mb: 3,
            "& .MuiOutlinedInput-root": {
              color: "white",
              "& fieldset": { borderColor: "rgba(249, 115, 22, 0.3)" },
              "&:hover fieldset": { borderColor: "rgba(249, 115, 22, 0.5)" },
              "&.Mui-focused fieldset": { borderColor: "#f97316" },
            },
            "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.6)" },
          }}
        />

        <Box
          sx={{
            border: "2px dashed rgba(249, 115, 22, 0.3)",
            borderRadius: 2,
            p: 3,
            textAlign: "center",
            bgcolor: "rgba(249, 115, 22, 0.05)",
            mb: 2,
          }}
        >
          <input
            accept="image/*,.pdf"
            style={{ display: "none" }}
            id="file-upload"
            type="file"
            onChange={handleFileChange}
            disabled={submitting}
          />
          <label htmlFor="file-upload">
            <Button
              variant="outlined"
              component="span"
              startIcon={<CloudUploadIcon />}
              disabled={submitting}
              sx={{
                borderColor: "#f97316",
                color: "#f97316",
                fontWeight: 600,
                "&:hover": {
                  borderColor: "#ea580c",
                  backgroundColor: "rgba(249, 115, 22, 0.1)",
                },
              }}
            >
              Upload Student ID
            </Button>
          </label>
          {file && (
            <Box mt={2}>
              <Typography
                variant="body2"
                sx={{ color: "#10b981", fontWeight: 600 }}
              >
                ✓ {file.name}
              </Typography>
              <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.5)" }}>
                {(file.size / 1024).toFixed(2)} KB
              </Typography>
            </Box>
          )}
          {!file && (
            <Typography
              variant="caption"
              sx={{ color: "rgba(255,255,255,0.5)", display: "block", mt: 1 }}
            >
              Accepted: JPG, PNG, PDF (max 2MB)
            </Typography>
          )}
        </Box>

        {submitting && (
          <Box sx={{ mb: 2 }}>
            <LinearProgress
              sx={{
                bgcolor: "rgba(249, 115, 22, 0.2)",
                "& .MuiLinearProgress-bar": {
                  bgcolor: "#f97316",
                },
              }}
            />
            <Typography
              variant="caption"
              sx={{ color: "rgba(255,255,255,0.6)", mt: 1, display: "block" }}
            >
              Submitting verification request...
            </Typography>
          </Box>
        )}

        <Alert
          severity="info"
          sx={{
            borderRadius: 2,
            backgroundColor: "rgba(99, 102, 241, 0.1)",
            border: "1px solid rgba(99, 102, 241, 0.3)",
          }}
        >
          <Typography variant="body2">
            Your documents are stored securely in your browser. After submission,
            share your wallet address with admin for approval.
          </Typography>
        </Alert>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          onClick={handleClose}
          disabled={submitting}
          sx={{ color: "rgba(255,255,255,0.6)" }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={submitting}
          sx={{
            background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
            fontWeight: 600,
            "&:disabled": {
              background: "rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.3)",
            },
          }}
        >
          {submitting ? "Submitting..." : "Submit Request"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}